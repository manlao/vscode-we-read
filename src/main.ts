import { ExtensionContext } from "vscode";

import { WeRead } from "./we-read";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(new WeRead());
}

export function deactivate() {}
