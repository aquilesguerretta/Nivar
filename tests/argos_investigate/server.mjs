import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";

export const fixtureUrl = "http://127.0.0.1:5286/tests/argos_investigate/fixture.html";

export async function startFixture() {
  const server = await createServer({
    configFile: false,
    envFile: false,
    root: fileURLToPath(new URL("../../", import.meta.url)),
    appType: "mpa",
    mode: "argos-local",
    plugins: [react()],
    optimizeDeps: { entries: ["tests/argos_investigate/mount.tsx"] },
    css: { postcss: { plugins: [] } },
    server: {
      host: "127.0.0.1",
      port: 5286,
      strictPort: true,
      cors: false,
      headers: {
        "Content-Security-Policy": [
          "default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'",
          "font-src 'self'", "img-src 'self' data:", "connect-src 'self' ws://127.0.0.1:5286",
        ].join("; "),
      },
    },
  });
  try {
    await server.listen();
    return server;
  } catch (error) {
    await server.close();
    throw error;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await startFixture();
  console.log(fixtureUrl);
}
