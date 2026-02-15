import {
	boolean,
	createBuilder,
	createSchema,
	json,
	number,
	string,
	table,
} from "@rocicorp/zero";

/**
 * Zero schema used by the realtime todo sync spike.
 */
const todo = table("todo")
	.columns({
		completed: boolean(),
		created_at_ms: number(),
		created_by: string(),
		id: string(),
		text: string(),
		updated_at_ms: number(),
		workspace_id: string(),
	})
	.primaryKey("id");

const todoEvent = table("todo_event")
	.columns({
		action: string(),
		at_ms: number(),
		id: string(),
		payload_json: json().optional(),
		todo_id: string(),
		user_id: string(),
		workspace_id: string(),
	})
	.primaryKey("id");

export const syncSchema = createSchema({
	tables: [todo, todoEvent],
});

export const syncQueryBuilder = createBuilder(syncSchema);
