// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const root = document.getElementById("app");
if (root) {
	mount(() => <StartClient />, root);
} else {
	console.error("Root not found");
}
