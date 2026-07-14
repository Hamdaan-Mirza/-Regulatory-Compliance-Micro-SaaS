import { Hono } from "hono";
import { cors } from "hono/cors";
import { usersRoute } from "./routes/users";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: ["https://your-production-domain.com", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/users", usersRoute);

export default app;