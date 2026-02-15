import { defineQueriesWithType, defineQueryWithType } from "@rocicorp/zero";
import type { SyncContext } from "./context";
import { syncQueryBuilder, type syncSchema } from "./schema";

/**
 * Synced query registry used by zero-cache query transformation.
 */
const defineSyncQueries = defineQueriesWithType<typeof syncSchema>();
const defineSyncQuery = defineQueryWithType<typeof syncSchema, SyncContext>();

export const syncQueries = defineSyncQueries({
	todoEvents: defineSyncQuery(({ ctx }) =>
		syncQueryBuilder.todo_event
			.where("workspace_id", ctx.workspaceID)
			.orderBy("at_ms", "desc")
			.limit(25),
	),
	todos: defineSyncQuery(({ ctx }) =>
		syncQueryBuilder.todo
			.where("workspace_id", ctx.workspaceID)
			.orderBy("created_at_ms", "asc"),
	),
});
