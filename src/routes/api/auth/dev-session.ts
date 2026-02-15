import type { HTTPEvent } from "vinxi/http";
import { getOrCreateDevSession } from "~/zero/session";

/**
 * Issues a lightweight dev session for the Zero spike.
 */
export async function GET(event: HTTPEvent) {
	const zeroCacheURL = process.env.ZERO_CACHE_URL ?? "http://localhost:4848";
	return Response.json({
		...getOrCreateDevSession(event),
		zeroCacheURL,
	});
}
