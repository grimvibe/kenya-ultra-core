// routes/api/v1/index.js
// Mounts all v1 API routes. Already wired into index.js:
//
//   import apiV1Router from "./routes/api/v1/index.js";
//   app.use("/api/v1", apiV1Router);

import express from "express";
import ytmp3Router from "./ytmp3.js";
import ytmp4Router from "./ytmp4.js";
import docsRouter from "./docs.js";

const router = express.Router();

router.use(ytmp3Router);
router.use(ytmp4Router);
router.use(docsRouter);

export default router;
