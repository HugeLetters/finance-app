/**
 * Shared sync context for the Zero demo integration.
 */
export type SyncContext = {
	readonly userID: string;
	readonly workspaceID: string;
};

export const DEMO_WORKSPACE_ID = "demo";
export const DEMO_USER_COOKIE_NAME = "demo_user_id";
