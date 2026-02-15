import { getWebRequest, type HTTPEvent } from "vinxi/http";
import { handleZeroQuery } from "~/zero/server";
import { getOrCreateDevSession } from "~/zero/session";

/**
 * Query transform endpoint consumed by zero-cache.
 */
export async function POST(event: HTTPEvent) {
	const session = getOrCreateDevSession(event);
	const request = getWebRequest(event);
	const response = await handleZeroQuery(request, session);
	return Response.json(response);
}
