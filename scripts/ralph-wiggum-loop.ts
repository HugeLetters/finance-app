/**
 * Runs a Ralph Wiggum loop for LLM CLIs.
 * Repeats the same prompt until a completion promise appears.
 */
import { Command, FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Logger } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

const DEFAULT_COMPLETION_PROMISE = "DONE";
const DEFAULT_MAX_ITERATIONS = 20;
const DEFAULT_COMMAND_ARGS = ["-m", "openai/gpt-5.2-codex"] as const;

type RalphConfig = {
	readonly prompt: string;
	readonly completionPromise: string;
	readonly maxIterations: number | null;
	readonly commandArgs: ReadonlyArray<string>;
};

class RalphLoopError extends Data.TaggedError("RalphLoopError")<{
	readonly message: string;
}> {}

const parseArgs = Effect.fn("parseArgs")(function* (
	argv: ReadonlyArray<string>,
) {
	let prompt: string | null = null;
	let promptFile: string | null = null;
	let completionPromise = DEFAULT_COMPLETION_PROMISE;
	let maxIterations: number | null = DEFAULT_MAX_ITERATIONS;
	const commandArgs: Array<string> = [...DEFAULT_COMMAND_ARGS];

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		switch (arg) {
			case "--prompt": {
				prompt = argv[index + 1] ?? null;
				index += 1;
				break;
			}
			case "--prompt-file": {
				promptFile = argv[index + 1] ?? null;
				index += 1;
				break;
			}
			case "--completion-promise": {
				completionPromise = argv[index + 1] ?? "";
				index += 1;
				break;
			}
			case "--max-iterations": {
				const raw = argv[index + 1];
				index += 1;
				maxIterations = raw ? Number(raw) : Number.NaN;
				break;
			}
			case "--command-arg": {
				const value = argv[index + 1];
				index += 1;
				if (value) {
					commandArgs.push(value);
				}
				break;
			}
			case "--no-max": {
				maxIterations = null;
				break;
			}
			default: {
				break;
			}
		}
	}

	if (!completionPromise) {
		return yield* new RalphLoopError({
			message: "Completion promise cannot be empty.",
		});
	}

	if (
		maxIterations !== null &&
		(!Number.isFinite(maxIterations) || maxIterations < 1)
	) {
		return yield* new RalphLoopError({
			message: "Max iterations must be a positive number.",
		});
	}

	const fs = yield* FileSystem.FileSystem;
	if (!prompt && promptFile) {
		prompt = yield* fs.readFileString(promptFile);
	}

	if (!prompt) {
		return yield* new RalphLoopError({
			message:
				"Missing prompt. Provide --prompt or --prompt-file for the loop.",
		});
	}

	return {
		prompt: `${prompt}. If you think you have completed the task - reply with ${completionPromise}`,
		completionPromise,
		maxIterations,
		commandArgs,
	} satisfies RalphConfig;
});

const runIteration = Effect.fn("runIteration")(function* (config: RalphConfig) {
	const command = Command.make(
		"opencode",
		"run",
		...config.commandArgs,
		config.prompt,
	);

	const process = yield* Command.start(command);
	const decoder = new TextDecoder("utf-8");

	const outputStream = process.stdout.pipe(
		Stream.map((chunk) => decoder.decode(chunk, { stream: true })),
	);

	yield* process.stderr.pipe(
		Stream.map((chunk) => decoder.decode(chunk, { stream: true })),
		Stream.runForEach((text) => Effect.logError(text)),
		Effect.andThen(() => {
			const flush = decoder.decode();
			if (flush) {
				return Effect.log(flush);
			}
		}),
		Effect.forkScoped,
	);

	return yield* outputStream.pipe(
		Stream.tap((text) => Effect.log(text)),
		Stream.runFold("", (out, chunk) => `${out}${chunk}`),
		Effect.tap(() => {
			const flush = decoder.decode();
			if (flush) {
				return Effect.log(flush);
			}
		}),
	);
});

const runLoop = Effect.fn("runLoop")(function* (config: RalphConfig) {
	let iteration = 1;
	while (config.maxIterations === null || iteration <= config.maxIterations) {
		yield* Effect.log(`Ralph loop iteration ${iteration}...`);
		const output = yield* runIteration(config);
		if (output.includes(config.completionPromise)) {
			yield* Effect.log("Completion promise detected. Loop finished.");
			return;
		}
		iteration += 1;
	}

	yield* Effect.log(
		`Max iterations reached (${config.maxIterations}). Stopping loop.`,
	);
});

Effect.gen(function* () {
	const argv = Bun.argv.slice(2);
	const config = yield* parseArgs(argv);
	const summary = [
		`maxIterations=${config.maxIterations ?? "unlimited"}`,
		`completionPromise=${config.completionPromise}`,
	];

	if (config.commandArgs.length > 0) {
		summary.push(`commandArgs=${config.commandArgs.join(" ")}`);
	}

	yield* Effect.log(`Starting Ralph loop (${summary.join(", ")})`);
	yield* runLoop(config);
}).pipe(
	Effect.catchAll((error) =>
		Effect.logFatal(error instanceof Error ? error.message : String(error)),
	),
	Effect.provide([Logger.pretty, BunContext.layer]),
	Effect.scoped,
	BunRuntime.runMain,
);
