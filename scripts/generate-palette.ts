import * as BunContext from "@effect/platform-bun/BunContext";
import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import { GeneratePalette } from "~/color/generate";

GeneratePalette.pipe(
	Effect.provide([Logger.pretty, BunContext.layer]),
	BunRuntime.runMain,
);
