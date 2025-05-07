import "dotenv/config";
import express from "express";
import expressStaticGzip from "express-static-gzip";
import compression from "compression";
import { handler } from "./build/handler.js";

const app = express();

app.use(
  "/_app/immutable",
  expressStaticGzip("build/client/_app/immutable", {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

app.use(
  "/static",
  expressStaticGzip("build/client/static", {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

app.use(compression());

app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
