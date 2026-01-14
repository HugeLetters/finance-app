import { expect } from "bun:test";
import { fail } from "node:assert/strict";
import * as Effect from "effect/Effect";
import * as Equal from "effect/Equal";
import * as Fn from "effect/Function";
import { UnknownDiffer } from "~/utils/differ";
import { Stdout } from "~/utils/stdout";

/**
 * Asserts that an Effect fails. Flips the result so that success becomes failure and vice versa.
 * Use this to test that Effects fail as expected.
 *
 * @example
 * ```ts
 * test.effect("should fail", () =>
 *   Effect.gen(function* () {
 *     return yield* Effect.fail("expected error");
 *   }).pipe(expectFail)
 * );
 * ```
 */
export function expectFail<E, R>(self: Effect.Effect<unknown, E, R>) {
	return self.pipe(Effect.map(unexpectedSuccess), Effect.flip);
}

const unexpectedSuccess = Fn.flow(
	(v) => Bun.inspect(v, { colors: true, depth: 10 }),
	(v) => `Expected effect to fail. Received\n${v}`,
	(m) => fail(m),
);

/**
 * Asserts that two values are equivalent using Effect's Equal typeclass.
 * Provides detailed diff output when values don't match.
 *
 * @example
 * ```ts
 * test.effect("should equal", () =>
 *   Effect.gen(function* () {
 *     const result = yield* someEffect();
 *     expectEquivalence(result, { expected: "value" });
 *   })
 * );
 * ```
 */
export function expectEquivalence<T>(received: T, expected: T) {
	const patch = UnknownDiffer.differ.diff(expected, received);
	const diff = UnknownDiffer.Formatter.format(patch);

	const message = `Expected ${Stdout.colored("red", received)} to equal ${Stdout.green(expected)}.\n${diff}`;
	return expect(Equal.equals(received, expected), message).toBeTrue();
}

export { test } from "./bun";
