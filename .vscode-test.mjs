import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  files: "out/test/**/*.test.js",
  // The definition provider resolves template paths against an open workspace.
  workspaceFolder: "src/test/fixtures",
  mocha: {
    ui: "tdd",
    timeout: 20000,
  },
});
