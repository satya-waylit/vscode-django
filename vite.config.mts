import { builtinModules } from "node:module";
import { defineConfig } from "vite";

// `vscode` is supplied by the extension host at runtime and is never bundled.
const VSCODE_EXTERNAL = ["vscode"];

// The desktop extension runs in Node, so its builtins stay external.
const NODE_EXTERNAL = [
  ...VSCODE_EXTERNAL,
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
];

export default defineConfig(({ mode }) => {
  const production = mode === "production";

  const shared = {
    outDir: "out",
    // Both environments emit into the same directory, so neither may clear it.
    emptyOutDir: false,
    sourcemap: true,
    minify: production,
    reportCompressedSize: false,
    lib: {
      entry: "src/extension.ts",
      formats: ["cjs" as const],
      // Output names are set per environment via `rolldownOptions.output`.
      // `lib.fileName` cannot be used here: Vite resolves it once for the whole
      // config, so both environments would emit under the same name.
    },
  };

  return {
    environments: {
      // Desktop extension host -> package.json `main`.
      node: {
        resolve: {
          // Custom environments default to the `server` consumer, which would
          // leave dependencies as bare `require()` calls. A shipped extension
          // must carry its dependencies inside the bundle.
          noExternal: true,
        },
        build: {
          ...shared,
          target: "node18",
          rolldownOptions: {
            external: NODE_EXTERNAL,
            output: { entryFileNames: "extension.js" },
          },
        },
      },
      // Web extension host, a webworker -> package.json `browser`.
      web: {
        resolve: {
          mainFields: ["browser", "module", "main"],
          noExternal: true,
        },
        build: {
          ...shared,
          target: "es2020",
          rolldownOptions: {
            external: VSCODE_EXTERNAL,
            output: { entryFileNames: "extension-web.js" },
          },
        },
      },
    },
    builder: {
      // `client` is a Vite default environment; this extension has no use for it.
      buildApp: async (builder) => {
        await builder.build(builder.environments.node);
        await builder.build(builder.environments.web);
      },
    },
  };
});
