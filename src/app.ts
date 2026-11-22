import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { globalErrorHandler } from "./lib/error/error-handler";

export function createApp() {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use("/api", router);
    app.use(globalErrorHandler);

    return app;
}
