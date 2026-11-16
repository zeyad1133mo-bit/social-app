import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes";

export function createApp() {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use("/api", router);

    return app;
}
