import "dotenv/config";
import express from "express";
import expressStaticGzip from "express-static-gzip";
import compression from "compression";
import { handler } from "./build/handler.js";

const app = express();

app.use(
  expressStaticGzip("build/client", {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    index: false,
    setHeaders: (res, path) => {
      if (/\.(css|js|png|jpe?g|webp|svg)$/.test(path)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

app.use(compression());

app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
