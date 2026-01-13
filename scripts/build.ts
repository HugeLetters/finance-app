import { Command } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Logger } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import { GeneratePalette } from "../src/color/generate";

class BuildError extends Data.TaggedError("BuildError")<{
	readonly message: string;
}> {}

Effect.gen(function* () {
	yield* Effect.log("Generating palette...");
	yield* GeneratePalette;
	yield* Effect.log("Palette generated successfully.");

	const buildCommand = Command.make("vinxi", "build").pipe(
		Command.stdout("inherit"),
		Command.stderr("inherit"),
	);
	const exit = yield* Command.exitCode(buildCommand);
	if (exit !== 0) {
		return yield* new BuildError({
			message: `Build exited with ${exit}`,
		});
	}
}).pipe(Effect.provide([Logger.pretty, BunContext.layer]), BunRuntime.runMain);
