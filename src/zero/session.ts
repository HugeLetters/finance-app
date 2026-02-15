import { getCookie, type HTTPEvent, setCookie } from "vinxi/http";
import {
	DEMO_USER_COOKIE_NAME,
	DEMO_WORKSPACE_ID,
	type SyncContext,
} from "./context";

/**
 * Reads or creates the development sync identity from cookies.
 */
export function getOrCreateDevSession(event: HTTPEvent): SyncContext {
	let userID = getCookie(event, DEMO_USER_COOKIE_NAME);
	if (userID === undefined || userID.length === 0) {
		userID = `user_${crypto.randomUUID()}`;
		setCookie(event, DEMO_USER_COOKIE_NAME, userID, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 365,
			path: "/",
			sameSite: "lax",
		});
	}

	return {
		userID,
		workspaceID: DEMO_WORKSPACE_ID,
	};
}
