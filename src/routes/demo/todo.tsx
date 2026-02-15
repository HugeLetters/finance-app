import {
	useConnectionState,
	useQuery,
	useZero,
	ZeroProvider,
} from "@rocicorp/zero/solid";
import { createSignal, For, onMount, Show } from "solid-js";
import { syncMutators } from "~/zero/mutators";
import { syncQueries } from "~/zero/queries";
import { syncSchema } from "~/zero/schema";

/**
 * Realtime todo demo page backed by Zero.
 */
type DevSession = {
	readonly userID: string;
	readonly workspaceID: string;
	readonly zeroCacheURL: string;
};

const createMutationMeta = () => ({
	at_ms: Date.now(),
	event_id: `event_${crypto.randomUUID()}`,
});

function TodoDemo(props: { readonly session: DevSession }) {
	const zero = useZero();
	const mutate = (mutationRequest: unknown) =>
		zero().mutate(mutationRequest as never);
	const connectionState = useConnectionState();
	const [todos] = useQuery(() => syncQueries.todos());
	const [todoEvents] = useQuery(() => syncQueries.todoEvents());

	const [editingTodoID, setEditingTodoID] = createSignal<string | undefined>();
	const [editingText, setEditingText] = createSignal("");
	const [newTodoText, setNewTodoText] = createSignal("");
	const [pendingCount, setPendingCount] = createSignal(0);
	const [lastError, setLastError] = createSignal<string | undefined>();

	const trackMutation = (runMutation: () => unknown) => {
		setPendingCount((count) => count + 1);
		const result = runMutation() as {
			readonly client: Promise<{
				readonly type: string;
				readonly message?: string;
			}>;
			readonly server: Promise<{
				readonly type: string;
				readonly message?: string;
			}>;
		};

		void result.client.catch((error: unknown) => {
			const message = error instanceof Error ? error.message : String(error);
			setLastError(message);
		});

		void result.server
			.then((details) => {
				if (details.type === "error") {
					setLastError(details.message ?? "Server rejected mutation.");
				}
			})
			.catch((error: unknown) => {
				const message = error instanceof Error ? error.message : String(error);
				setLastError(message);
			})
			.finally(() => {
				setPendingCount((count) => Math.max(0, count - 1));
			});
	};

	const createTodo = () => {
		const text = newTodoText().trim();
		if (text.length === 0) {
			return;
		}
		setLastError(undefined);
		setNewTodoText("");

		const mutationMeta = createMutationMeta();
		trackMutation(() =>
			mutate(
				syncMutators.todo.create({
					...mutationMeta,
					id: `todo_${crypto.randomUUID()}`,
					text,
				}),
			),
		);
	};

	const saveEdit = () => {
		const todoID = editingTodoID();
		if (todoID === undefined) {
			return;
		}
		const text = editingText().trim();
		if (text.length === 0) {
			return;
		}
		setLastError(undefined);

		const mutationMeta = createMutationMeta();
		trackMutation(() =>
			mutate(
				syncMutators.todo.edit({
					...mutationMeta,
					id: todoID,
					text,
				}),
			),
		);
		setEditingTodoID(undefined);
	};

	return (
		<div class="mx-auto max-w-5xl p-4 sm:p-8">
			<div class="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
				<h1 class="text-2xl font-semibold text-neutral-900">
					Realtime Todo Demo
				</h1>
				<p class="mt-2 text-sm text-neutral-600">
					Zero sync status:{" "}
					<span class="font-medium text-neutral-900">
						{connectionState().name}
					</span>
					{" | "}
					Pending server confirmations:{" "}
					<span class="font-medium text-neutral-900">{pendingCount()}</span>
				</p>
				<p class="mt-1 text-xs text-neutral-500">
					User: {props.session.userID} | Workspace: {props.session.workspaceID}
				</p>
				<Show when={lastError()}>
					<p class="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
						{lastError()}
					</p>
				</Show>
			</div>

			<div class="grid gap-6 md:grid-cols-[2fr_1fr]">
				<section class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
					<div class="mb-4 flex gap-2">
						<input
							class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
							onInput={(event) => setNewTodoText(event.currentTarget.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									createTodo();
								}
							}}
							placeholder="Add a todo and press Enter"
							value={newTodoText()}
						/>
						<button
							class="rounded-lg bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
							onClick={createTodo}
							type="button"
						>
							Add
						</button>
					</div>

					<ul class="space-y-2">
						<For each={todos()}>
							{(todo) => (
								<li class="flex items-center gap-2 rounded-lg border border-neutral-200 p-2">
									<input
										checked={todo.completed}
										onChange={() => {
											setLastError(undefined);
											const mutationMeta = createMutationMeta();
											trackMutation(() =>
												mutate(
													syncMutators.todo.toggle({
														...mutationMeta,
														id: todo.id,
													}),
												),
											);
										}}
										type="checkbox"
									/>

									<Show
										fallback={
											<button
												class={`min-w-0 flex-1 truncate text-left text-sm ${todo.completed ? "text-neutral-400 line-through" : "text-neutral-900"}`}
												onClick={() => {
													setEditingTodoID(todo.id);
													setEditingText(todo.text);
												}}
												type="button"
											>
												{todo.text}
											</button>
										}
										when={editingTodoID() === todo.id}
									>
										<input
											class="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-sky-500"
											onBlur={saveEdit}
											onInput={(event) =>
												setEditingText(event.currentTarget.value)
											}
											onKeyDown={(event) => {
												if (event.key === "Enter") {
													saveEdit();
												}
												if (event.key === "Escape") {
													setEditingTodoID(undefined);
												}
											}}
											value={editingText()}
										/>
									</Show>

									<button
										class="rounded-md px-2 py-1 text-xs text-red-700 hover:bg-red-50"
										onClick={() => {
											setLastError(undefined);
											const mutationMeta = createMutationMeta();
											trackMutation(() =>
												mutate(
													syncMutators.todo.delete({
														...mutationMeta,
														id: todo.id,
													}),
												),
											);
										}}
										type="button"
									>
										Delete
									</button>
								</li>
							)}
						</For>
					</ul>
				</section>

				<aside class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
					<h2 class="mb-3 text-sm font-semibold text-neutral-900">
						Recent Events
					</h2>
					<ul class="space-y-2 text-xs text-neutral-600">
						<For each={todoEvents()}>
							{(event) => (
								<li class="rounded-md border border-neutral-200 px-2 py-1">
									<div class="font-medium text-neutral-800">{event.action}</div>
									<div class="truncate">{event.todo_id}</div>
									<div>{new Date(event.at_ms).toLocaleTimeString()}</div>
								</li>
							)}
						</For>
					</ul>
				</aside>
			</div>
		</div>
	);
}

export default function TodoDemoRoute() {
	const [session, setSession] = createSignal<DevSession | undefined>();
	const [sessionError, setSessionError] = createSignal<string | undefined>();

	onMount(() => {
		void (async () => {
			try {
				const response = await fetch("/api/auth/dev-session");
				if (!response.ok) {
					throw new Error(`Session request failed with ${response.status}`);
				}
				const data = (await response.json()) as DevSession;
				setSession(data);
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : String(error);
				setSessionError(message);
			}
		})();
	});

	return (
		<main class="min-h-screen bg-neutral-50">
			<Show
				fallback={
					<div class="mx-auto max-w-3xl p-8">
						<p class="text-sm text-neutral-600">
							{sessionError() ?? "Loading realtime todo demo..."}
						</p>
					</div>
				}
				when={session()}
			>
				{(activeSession) => (
					<ZeroProvider
						context={{
							userID: activeSession().userID,
							workspaceID: activeSession().workspaceID,
						}}
						kvStore="idb"
						logLevel="info"
						mutators={syncMutators}
						schema={syncSchema}
						server={activeSession().zeroCacheURL}
						userID={activeSession().userID}
					>
						<TodoDemo session={activeSession()} />
					</ZeroProvider>
				)}
			</Show>
		</main>
	);
}
