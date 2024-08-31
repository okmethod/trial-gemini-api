import { purgeCss } from "vite-plugin-tailwind-purgecss";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

// 環境変数のロード
const envFiles = [
  //`.env.${process.env.NODE_ENV}`
  ".env",
];

for (const file of envFiles) {
  dotenv.config({ path: path.resolve(__dirname, file) });
}

const content404 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <meta http-equiv="refresh" content="0; url=/#/">
  <script>
    // Redirect to the root URL
    var path = window.location.pathname;
    var newUrl = window.location.origin;
    window.location.replace(newUrl);
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
`;

export default defineConfig({
  publicDir: "static",
  define: {
    "process.env": process.env,
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        pure_funcs: ["console.debug"], // console.debug を無効化
      },
    },
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://okmethod-gemini-trial.web.app",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    sveltekit(),
    purgeCss(),
    {
      name: "generate-404",
      closeBundle() {
        const dirPath = path.resolve(__dirname, "build");
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.resolve(dirPath, "404.html");
        fs.writeFileSync(filePath, content404);
        console.log("404.html generated");
      },
    },
    {
      name: "log-version",
      closeBundle() {
        const versionFilePath = path.resolve(__dirname, "build/app/version.json");
        if (fs.existsSync(versionFilePath)) {
          const versionContent = fs.readFileSync(versionFilePath, "utf-8");
          console.log("version.json:", versionContent);
        } else {
          console.log("version.json not found");
        }
      },
    },
  ],
});
