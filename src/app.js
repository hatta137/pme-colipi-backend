import express from "express";
import wgRouter from "./routes/wg_router.js";
import mongoose from "mongoose";

const app = express();
const port = 20013;

/* Middlewares */
app.use(express.json());

/* Routes */
app.use("/api/wg", wgRouter);

/* MongoDB */
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1/colipi";
await mongoose.connect(MONGODB_URL);

/* Listener */
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});