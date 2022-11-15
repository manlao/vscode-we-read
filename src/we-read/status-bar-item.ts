import { Disposable, StatusBarAlignment, StatusBarItem, window } from "vscode";

import { WeReadCommand } from "./enum";

export class WeReadStatusBarItem implements Disposable {
  private _statusBarItem?: StatusBarItem;

  constructor() {
    this._statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      100,
    );
    this._statusBarItem.command = WeReadCommand.Open;
    this._statusBarItem.text = "$(book)";
    this._statusBarItem.tooltip = "微信读书";
    this._statusBarItem.show();
  }

  dispose() {
    this._statusBarItem?.dispose();
  }
}
