import { handleQueryRequest, PushProcessor } from "@rocicorp/zero/server";
import { zeroPostgresJS } from "@rocicorp/zero/server/adapters/postgresjs";
import type { SyncContext } from "./context";
import { syncMutators } from "./mutators";
import { syncQueryBuilder, syncSchema } from "./schema";

/**
 * Server-side Zero entry points for query transformation and mutator execution.
 */
let zqlDatabase:
	| ReturnType<typeof zeroPostgresJS<typeof syncSchema>>
	| undefined;

const getUpstreamDatabaseUrl = (): string => {
	const databaseUrl = process.env.ZERO_UPSTREAM_DB;
	if (databaseUrl === undefined || databaseUrl.length === 0) {
		throw new Error("ZERO_UPSTREAM_DB is required for Zero integration.");
	}
	return databaseUrl;
};

const getZqlDatabase = (): ReturnType<
	typeof zeroPostgresJS<typeof syncSchema>
> => {
	if (zqlDatabase !== undefined) {
		return zqlDatabase;
	}

	zqlDatabase = zeroPostgresJS(syncSchema, getUpstreamDatabaseUrl());
	return zqlDatabase;
};

export const handleZeroQuery = async (
	request: Request,
	context: SyncContext,
) => {
	return handleQueryRequest(
		(queryName, args) => {
			if (queryName === "todos") {
				return syncQueryBuilder.todo
					.where("workspace_id", context.workspaceID)
					.orderBy("created_at_ms", "asc");
			}
			if (queryName === "todoEvents") {
				return syncQueryBuilder.todo_event
					.where("workspace_id", context.workspaceID)
					.orderBy("at_ms", "desc")
					.limit(25);
			}
			throw new Error(
				`Unknown Zero query: ${queryName} (${JSON.stringify(args)})`,
			);
		},
		syncSchema,
		request,
		"info",
	);
};

export const handleZeroMutate = async (
	request: Request,
	context: SyncContext,
) => {
	const pushProcessor = new PushProcessor(getZqlDatabase(), context, "info");
	return pushProcessor.process(syncMutators, request);
};
