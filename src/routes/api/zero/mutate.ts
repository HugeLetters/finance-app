import { getWebRequest, type HTTPEvent } from "vinxi/http";
import { handleZeroMutate } from "~/zero/server";
import { getOrCreateDevSession } from "~/zero/session";

/**
 * Mutate endpoint consumed by zero-cache.
 */
export async function POST(event: HTTPEvent) {
	const session = getOrCreateDevSession(event);
	const request = getWebRequest(event);
	const response = await handleZeroMutate(request, session);
	return Response.json(response);
}
