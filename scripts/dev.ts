import { Command, FileSystem } from "@effect/platform";
import * as Path from "@effect/platform/Path";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Logger } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

class DevError extends Data.TaggedError("DevError")<{
	readonly message: string;
}> {}

Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem;
	const path = yield* Path.Path;

	const PaletteGenerator = Effect.gen(function* () {
		const script = path.resolve(import.meta.dir, "generate-palette.ts");
		const cmd = Command.make("bun", "run", script).pipe(
			Command.stdout("inherit"),
			Command.stderr("inherit"),
		);
		const Run = Effect.gen(function* () {
			const exit = yield* Command.exitCode(cmd);
			if (exit !== 0) {
				return yield* new DevError({
					message: `Palette generator exited with ${exit}`,
				});
			}
		});

		yield* Effect.log("Generating initial palette...");
		yield* Run.pipe(Effect.catchAll(Effect.logFatal));
		yield* Effect.log("Initial palette generated successfully.");

		const paletteFile = path.resolve(
			import.meta.dir,
			"..",
			"src",
			"color",
			"palette.ts",
		);
		const paletteWatcher = fs.watch(paletteFile);
		yield* Stream.runForEach(
			paletteWatcher,
			Effect.fn(function* (event) {
				yield* Effect.log(
					`Palette file changed (${event._tag}), regenerating...`,
				);
				yield* Run;
				yield* Effect.log("Palette regenerated successfully.");
			}, Effect.catchAll(Effect.logFatal)),
		);
	});

	const DebBuild = Effect.gen(function* () {
		const cmd = Command.make("vinxi", "dev").pipe(
			Command.stdout("inherit"),
			Command.stderr("inherit"),
		);
		const exit = yield* Command.exitCode(cmd);
		if (exit !== 0) {
			return yield* new DevError({
				message: `Dev server exited with ${exit}`,
			});
		}
	});

	yield* Effect.all([PaletteGenerator, DebBuild], { concurrency: "unbounded" });
}).pipe(
	Effect.catchAll(Effect.logFatal),
	Effect.provide([Logger.pretty, BunContext.layer]),
	BunRuntime.runMain,
);
