import * as nodeAssert from "node:assert/strict";
import * as vscode from "vscode";

import { TemplatePathProvider } from "../providers/definitionProvider";
import { SnippetProvider } from "../utils";

/* Node's assertion functions only narrow types through an explicitly typed
   binding, which a namespace import is not. */
const assert: typeof nodeAssert = nodeAssert;

const EXTENSION_ID = "batisteo.vscode-django";

function extension(): vscode.Extension<unknown> {
  const found = vscode.extensions.getExtension(EXTENSION_ID);
  if (!found) throw new Error(`extension ${EXTENSION_ID} is not installed`);
  return found;
}

function fixture(...segments: string[]): vscode.Uri {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) throw new Error("tests must run against the fixture workspace");
  return vscode.Uri.joinPath(folder.uri, ...segments);
}

async function definitionAt(
  uri: vscode.Uri,
  line: number,
  character: number,
): Promise<vscode.Definition | null | undefined> {
  const document = await vscode.workspace.openTextDocument(uri);
  const provider = new TemplatePathProvider();
  const tokens = new vscode.CancellationTokenSource();
  try {
    return await Promise.resolve(
      provider.provideDefinition(document, new vscode.Position(line, character), tokens.token),
    );
  } finally {
    tokens.dispose();
  }
}

function locationPath(definition: vscode.Definition | null | undefined): string {
  if (!definition || Array.isArray(definition)) {
    throw new Error(`expected a single Location, got ${JSON.stringify(definition)}`);
  }
  return definition.uri.path;
}

suite("vscode-django", () => {
  test("activates", async () => {
    await extension().activate();
    assert.equal(extension().isActive, true);
  });

  test("parses the TOML snippet files it ships", async () => {
    const snippets = await new SnippetProvider(extension().extensionUri).readSnippets(
      "python/imports.toml",
    );

    assert.ok(snippets.length > 0, "expected at least one snippet");
    for (const snippet of snippets) {
      assert.equal(typeof snippet.prefix, "string");
      assert.equal(typeof snippet.body, "string");
    }
  });

  test("resolves a relative template path against the document", async () => {
    const definition = await definitionAt(fixture("templates", "app", "index.html"), 0, 15);

    assert.match(locationPath(definition), /templates\/app\/partial\.html$/);
  });

  test("resolves a bare template path by searching the workspace", async () => {
    const definition = await definitionAt(fixture("templates", "app", "index.html"), 1, 15);

    assert.match(locationPath(definition), /templates\/app\/other\.html$/);
  });

  test("offers no definition when the cursor is off the path", async () => {
    const definition = await definitionAt(fixture("templates", "app", "index.html"), 0, 1);

    assert.equal(definition, null);
  });
});
