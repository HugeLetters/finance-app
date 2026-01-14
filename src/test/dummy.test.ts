import * as Effect from "effect/Effect";
import { expectEquivalence, test } from "./index";

test.effect(
	"dummy success test",
	Effect.fn(function* () {
		const result = yield* Effect.succeed(42);
		expectEquivalence(result, 42);
	}),
);

test.effect.fails("dummy fail test", () => Effect.fail("expected failure"));
