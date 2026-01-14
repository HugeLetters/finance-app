import { Data } from "effect";
import * as Effect from "effect/Effect";
import { expectEquivalence, test } from "./index";

class TestData extends Data.Class<{ value: number; name: string }> {}

test.effect(
	"dummy success test",
	Effect.fn(function* () {
		const result = yield* Effect.succeed(
			new TestData({ value: 42, name: "test" }),
		);
		yield* expectEquivalence(result, new TestData({ value: 42, name: "test" }));

		yield* expectEquivalence(
			new Map([[1, new Set([3, 2])]]),
			new Map([[1, new Set([2, 3])]]),
		);
	}),
);

test.effect.fails("dummy fail test", () => Effect.fail("expected failure"));
