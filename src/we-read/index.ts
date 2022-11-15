import { Disposable, commands } from "vscode";

import { WeReadCommand } from "./enum";
import { WeReadStatusBarItem } from "./status-bar-item";
import { WeReadWebviewPanel } from "./webview-panel";

export class WeRead implements Disposable {
  command: Disposable;
  statusBarItem: WeReadStatusBarItem;
  webviewPanel?: WeReadWebviewPanel;

  constructor() {
    this.command = commands.registerCommand(WeReadCommand.Open, () => {
      this.open();
    });
    this.statusBarItem = new WeReadStatusBarItem();
  }

  open() {
    if (!this.webviewPanel) {
      this.webviewPanel = new WeReadWebviewPanel();
      this.webviewPanel.onDidDispose(() => (this.webviewPanel = undefined));
    }

    this.webviewPanel?.reveal();
  }

  dispose() {
    this.command.dispose();
    this.statusBarItem.dispose();
    this.webviewPanel?.dispose();
  }
}
