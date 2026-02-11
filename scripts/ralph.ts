/**
 * Runs a Ralph Wiggum loop for LLM CLIs.
 * Repeats the same prompt until a completion promise appears.
 */
import { Command as Cli, Options, ValidationError } from "@effect/cli";
import * as Args from "@effect/cli/Args";
import * as HelpDoc from "@effect/cli/HelpDoc";
import * as Shell from "@effect/platform/Command";
import * as FileSystem from "@effect/platform/FileSystem";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Logger } from "effect";
import * as Arr from "effect/Array";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Stream from "effect/Stream";
import * as Str from "effect/String";

type RalphConfig = Cli.Command.ParseConfig<typeof CliConfig>;

const runIteration = Effect.fn("runIteration")(function* (config: RalphConfig) {
    const fs = yield* FileSystem.FileSystem;
    const ralphPrompt = yield* fs.readFileString("scripts/ralph.md");
	const prompt =
		`${config.fullPrompt}\n` +
		`${ralphPrompt}\n` +
		`After completing each task, append to ${config.progressFile}\n` +
		`If, while implementing the feature, you notice that all work is complete, output ${config.completionPromise}`;

	const command = Shell.make(
		"opencode",
		"run",
		"-m",
		config.model,
		...config.commandArgs,
	).pipe(Shell.feed(prompt));

	const process = yield* Shell.start(command);
	const decoder = new TextDecoder("utf-8");

	const outputStream = process.stdout.pipe(
		Stream.map((chunk) => decoder.decode(chunk, { stream: true })),
	);

	yield* process.stderr.pipe(
		Stream.map((chunk) => decoder.decode(chunk, { stream: true })),
		Stream.runForEach((text) => Effect.logInfo(text)),
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
}, Effect.scoped);

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

const prompts = Options.text("prompt").pipe(
	Options.withDescription("Prompt text to send to the CLI"),
	Options.repeated,
);

const filePrompts = Options.text("prompt-file").pipe(
	Options.withDescription("File path to read additional prompt text"),
	Options.repeated,
	Options.mapEffect(
		Effect.fnUntraced(function* (files) {
			const fs = yield* FileSystem.FileSystem;
			return yield* Effect.all(
				files.map((filePath) => fs.readFileString(filePath)),
			).pipe(
				Effect.mapError((e) =>
					ValidationError.invalidValue(HelpDoc.p(e.message)),
				),
			);
		}),
	),
);

const fullPrompt = Options.all({ prompts, filePrompts }).pipe(
	Options.map(({ prompts, filePrompts }) => [...prompts, ...filePrompts]),
	Options.filterMap(
		Option.liftPredicate(Arr.isNonEmptyReadonlyArray),
		"Missing prompt",
	),
	Options.map(Arr.join("\n")),
);

const completionPromise = Options.text("completion-promise").pipe(
	Options.withDescription("Token that ends the loop when seen in output"),
	Options.withDefault("DONE"),
	Options.filterMap(
		Option.liftPredicate(Str.isNonEmpty),
		"completion-promise cannot be empty",
	),
	Options.map((promise) => `<promise>${promise}</promise>`),
);

const progressFile = Options.text("progress-file").pipe(
	Options.withDescription(
		"File path to append streamed output for progress tracking",
	),
	Options.withDefault("progress.txt"),
);

const maxIterations = Options.integer("max-iterations").pipe(
	Options.withDescription("Maximum iterations before stopping"),
	Options.filterMap(
		Option.liftPredicate((iterations) => iterations > 0),
		"Max iterations must be a positive integer.",
	),
	Options.withDefault(null),
);

const noMax = Options.boolean("no-max").pipe(
	Options.withDescription("Run without an iteration limit"),
);

const CliConfig = {
	fullPrompt,
	completionPromise,
	progressFile,
	maxIterations: Options.all({ maxIterations, noMax }).pipe(
		Options.filterMap(({ maxIterations, noMax }) => {
			if (noMax) {
				if (maxIterations !== null) {
					return Option.none();
				}

				return Option.some(null);
			}

			return Option.some(maxIterations ?? 10);
		}, "Cannot use no-max and max-iterations at the same time"),
	),
	model: Options.text("model").pipe(
		Options.withAlias("m"),
		Options.withDescription("Model to use"),
		Options.withDefault("openai/gpt-5.2-codex"),
	),
	commandArgs: Args.repeated(Args.text({ name: "args" })).pipe(
		Args.withDescription("Extra argument passed to opencode"),
	),
};

const ralphLoopCommand = Cli.make(
	"ralph-wiggum-loop",
	CliConfig,
	Effect.fnUntraced(function* (options) {
		yield* Effect.log("Starting Ralph loop").pipe(Effect.annotateLogs(options));
		yield* runLoop(options);
	}),
).pipe(
	Cli.withDescription(
		"Repeats a prompt until a completion promise appears in output.",
	),
);

const cli = Cli.run(ralphLoopCommand, {
	name: "Ralph Wiggum Loop",
	version: "0.1.0",
});

cli(Bun.argv).pipe(
	Effect.catchAll((error) => {
		if (ValidationError.isValidationError(error)) {
			return Effect.void;
		}

		return Effect.logFatal(error);
	}),
	Effect.provide([Logger.pretty, BunContext.layer]),
	BunRuntime.runMain,
);
