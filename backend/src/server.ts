import express, { response } from "express";
import { db } from "./db";
import { authRouter } from "./routes/auth";
import cors from "cors";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/auth", authRouter);


app.get("/health", async (_request, response) => {
    const result = await db.query("SELECT 1 AS database_ok");

    response.json({
        status: "ok",
        database: result.rows[0].database_ok === 1,
    });
});
app.post("/echo", (request, response) => { 
    response.json({ received: request.body });
    });

app.listen(port, () => {
    console.log(`API запущен: http://localhost:${port}`);
});
