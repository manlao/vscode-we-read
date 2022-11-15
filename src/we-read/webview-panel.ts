import {
  Disposable,
  EventEmitter,
  ViewColumn,
  WebviewPanel,
  window,
} from "vscode";

import { createProxyServer } from "./proxy-server";

export class WeReadWebviewPanel implements Disposable {
  private _webviewPanel?: WebviewPanel;
  private _onDidDispose = new EventEmitter<void>();
  readonly onDidDispose = this._onDidDispose.event;

  constructor() {
    this.init();
  }

  async init() {
    const { server, port } = await createProxyServer();

    this._webviewPanel = window.createWebviewPanel(
      "WeRead",
      "微信读书",
      window.activeTextEditor?.viewColumn || ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );

    this._webviewPanel.webview.html = `<!DOCTYPE html>
      <html lang="zh">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>微信读书</title>
          <style>
            html, body {
              width: 100%;
              height: 100%;
              border: 0;
              margin: 0;
              padding: 0;
              overflow: hidden;
              position: relative;
            }

            iframe {
              width: 100%;
              minHeight: 100%;
              margin: 0 auto;
              border: 0;
              margin: 0;
              transform-origin: top left;
            }
          </style>
          <script>
            function resize(scale) {
              var iframe = document.getElementById('iframe');

              if (iframe) {
                if (scale >= 1) {
                  iframe.style.width = '100%';
                  iframe.style.height = '100%';
                  iframe.style.padding = '0 calc(50% - (1366 / 2))';
                  iframe.style.transform = 'none';
                } else {
                  iframe.style.width = '1366px';
                  iframe.style.height = (window.innerHeight / scale) + 'px';
                  iframe.style.padding = '0';
                  iframe.style.transform = 'translate(0, 0) scale(' + scale + ') translateZ(0)';
                }
              }

              window.scale = scale;
            }

            function init() {
              resize(window.innerWidth / 1366);
            }

            window.onload = init;
            window.onresize = init;
          </script>
        </head>
        <body>
          <iframe id="iframe" src="http://localhost:${port}"/>
        </body>
      </html>`;

    this._webviewPanel.onDidDispose(() => {
      server.close();
      this._onDidDispose.fire();
    });
  }

  reveal() {
    this._webviewPanel?.reveal();
  }

  dispose() {
    this._webviewPanel?.dispose();
  }
}
