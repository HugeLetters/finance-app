/**
 * Runs a Ralph Wiggum loop for LLM CLIs.
 * Repeats the same prompt until a completion promise appears.
 */
import { Command, FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Logger } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";

const DEFAULT_COMMAND = "opencode";
const DEFAULT_COMPLETION_PROMISE = "DONE";
const DEFAULT_MAX_ITERATIONS = 20;

type RalphConfig = {
	readonly prompt: string;
	readonly completionPromise: string;
	readonly maxIterations: number | null;
	readonly command: string;
	readonly commandArgs: ReadonlyArray<string>;
	readonly promptFlag: string | null;
};

class RalphLoopError extends Data.TaggedError("RalphLoopError")<{
	readonly message: string;
}> {}

const parseArgs = (argv: ReadonlyArray<string>) =>
	Effect.gen(function* () {
		let prompt: string | null = null;
		let promptFile: string | null = null;
		let completionPromise = DEFAULT_COMPLETION_PROMISE;
		let maxIterations: number | null = DEFAULT_MAX_ITERATIONS;
		let command = DEFAULT_COMMAND;
		const commandArgs: Array<string> = [];
		let promptFlag: string | null = null;

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
				case "--command": {
					command = argv[index + 1] ?? "";
					index += 1;
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
				case "--prompt-flag": {
					promptFlag = argv[index + 1] ?? null;
					index += 1;
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

		if (!prompt && !promptFile) {
			return yield* new RalphLoopError({
				message:
					"Missing prompt. Provide --prompt or --prompt-file for the loop.",
			});
		}

		if (!completionPromise) {
			return yield* new RalphLoopError({
				message: "Completion promise cannot be empty.",
			});
		}

		if (!command) {
			return yield* new RalphLoopError({
				message: "Command cannot be empty.",
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

		return {
			prompt: prompt ?? "",
			completionPromise,
			maxIterations,
			command,
			commandArgs,
			promptFlag,
		} satisfies RalphConfig;
	});

const runIteration = (config: RalphConfig) =>
	Effect.gen(function* () {
		const args = config.promptFlag
			? [...config.commandArgs, config.promptFlag, config.prompt]
			: [...config.commandArgs];

		const baseCommand = Command.make(config.command, ...args).pipe(
			Command.stderr("inherit"),
		);
		const command = config.promptFlag
			? baseCommand
			: baseCommand.pipe(Command.feed(config.prompt));
		const output = yield* Command.string(command);
		yield* Effect.sync(() => {
			process.stdout.write(output);
		});
		return output;
	});

const runLoop = (config: RalphConfig) =>
	Effect.gen(function* () {
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
		`command=${config.command}`,
		`maxIterations=${config.maxIterations ?? "unlimited"}`,
		`completionPromise=${config.completionPromise}`,
		`promptMode=${config.promptFlag ? "arg" : "stdin"}`,
	];
	if (config.commandArgs.length > 0) {
		summary.push(`commandArgs=${config.commandArgs.join(" ")}`);
	}
	if (config.promptFlag) {
		summary.push(`promptFlag=${config.promptFlag}`);
	}

	yield* Effect.log(`Starting Ralph loop (${summary.join(", ")})`);
	yield* runLoop(config);
}).pipe(
	Effect.catchAll((error) =>
		Effect.logFatal(error instanceof Error ? error.message : String(error)),
	),
	Effect.provide([Logger.pretty, BunContext.layer]),
	BunRuntime.runMain,
);
