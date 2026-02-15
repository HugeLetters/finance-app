import {
	defineMutatorsWithType,
	defineMutatorWithType,
	type ReadonlyJSONValue,
} from "@rocicorp/zero";
import { z } from "zod";
import type { SyncContext } from "./context";
import { syncQueryBuilder, type syncSchema } from "./schema";

/**
 * Mutators for optimistic + authoritative todo synchronization.
 */
const defineSyncMutator = defineMutatorWithType<
	typeof syncSchema,
	SyncContext
>();
const defineSyncMutators = defineMutatorsWithType<typeof syncSchema>();

const CreateTodoArgs = z.object({
	at_ms: z.number(),
	event_id: z.string().min(1),
	id: z.string().min(1),
	text: z.string().min(1),
});

const ToggleTodoArgs = z.object({
	at_ms: z.number(),
	event_id: z.string().min(1),
	id: z.string().min(1),
});

const EditTodoArgs = z.object({
	at_ms: z.number(),
	event_id: z.string().min(1),
	id: z.string().min(1),
	text: z.string().min(1),
});

const DeleteTodoArgs = z.object({
	at_ms: z.number(),
	event_id: z.string().min(1),
	id: z.string().min(1),
});

export const syncMutators = defineSyncMutators({
	todo: {
		create: defineSyncMutator(CreateTodoArgs, async ({ args, ctx, tx }) => {
			await tx.mutate.todo.insert({
				completed: false,
				created_at_ms: args.at_ms,
				created_by: ctx.userID,
				id: args.id,
				text: args.text,
				updated_at_ms: args.at_ms,
				workspace_id: ctx.workspaceID,
			});

			await tx.mutate.todo_event.insert({
				action: "created",
				at_ms: args.at_ms,
				id: args.event_id,
				payload_json: {
					text: args.text,
				},
				todo_id: args.id,
				user_id: ctx.userID,
				workspace_id: ctx.workspaceID,
			});
		}),
		delete: defineSyncMutator(DeleteTodoArgs, async ({ args, ctx, tx }) => {
			const existingTodo = await tx.run(
				syncQueryBuilder.todo
					.where("id", args.id)
					.where("workspace_id", ctx.workspaceID)
					.one(),
			);
			if (existingTodo === undefined) {
				return;
			}

			await tx.mutate.todo.delete({
				id: args.id,
			});

			await tx.mutate.todo_event.insert({
				action: "deleted",
				at_ms: args.at_ms,
				id: args.event_id,
				payload_json: {
					text: existingTodo.text,
				} satisfies ReadonlyJSONValue,
				todo_id: args.id,
				user_id: ctx.userID,
				workspace_id: ctx.workspaceID,
			});
		}),
		edit: defineSyncMutator(EditTodoArgs, async ({ args, ctx, tx }) => {
			const existingTodo = await tx.run(
				syncQueryBuilder.todo
					.where("id", args.id)
					.where("workspace_id", ctx.workspaceID)
					.one(),
			);
			if (existingTodo === undefined) {
				return;
			}

			await tx.mutate.todo.update({
				id: args.id,
				text: args.text,
				updated_at_ms: args.at_ms,
			});

			await tx.mutate.todo_event.insert({
				action: "edited",
				at_ms: args.at_ms,
				id: args.event_id,
				payload_json: {
					text: args.text,
				},
				todo_id: args.id,
				user_id: ctx.userID,
				workspace_id: ctx.workspaceID,
			});
		}),
		toggle: defineSyncMutator(ToggleTodoArgs, async ({ args, ctx, tx }) => {
			const existingTodo = await tx.run(
				syncQueryBuilder.todo
					.where("id", args.id)
					.where("workspace_id", ctx.workspaceID)
					.one(),
			);
			if (existingTodo === undefined) {
				return;
			}

			const nextCompleted = !existingTodo.completed;
			await tx.mutate.todo.update({
				completed: nextCompleted,
				id: args.id,
				updated_at_ms: args.at_ms,
			});

			await tx.mutate.todo_event.insert({
				action: "toggled",
				at_ms: args.at_ms,
				id: args.event_id,
				payload_json: {
					completed: nextCompleted,
				},
				todo_id: args.id,
				user_id: ctx.userID,
				workspace_id: ctx.workspaceID,
			});
		}),
	},
});
