import { Router } from "express";
import * as argon2 from "argon2";
import { db } from "../db";
import { randomBytes } from "node:crypto";

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
    const { name, username, password, passwordConfirmation } = request.body;

    if (
        typeof name !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof passwordConfirmation !== "string"
    ) {
        return response.status(400).json({
            message: "Все поля должны быть строками",
        });
    }

    const normalizedName = name.trim();
    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedName || !normalizedUsername || !password || !passwordConfirmation) {
        return response.status(400).json({
            message: "Все поля обязательны",
        });
    }

    if (normalizedName.length < 2) {
        return response.status(400).json({
            message: "Имя должно содержать минимум 2 символа",
        });
    }

    if (password.trim().length === 0) {
        return response.status(400).json({
            message: "Пароль не может состоять только из пробелов",
        });
    }

    if (password.length < 8) {
        return response.status(400).json({
            message: "Пароль должен быть не менее 8 символов",
        });
    }

    if (password !== passwordConfirmation) {
        return response.status(400).json({
            message: "Пароли не совпадают",
        });
    }

    const passwordHash = await argon2.hash(password);

    const result = await db.query(
        `INSERT INTO users (name, username, password_hash)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        RETURNING id, name, username, created_at`,
        [normalizedName, normalizedUsername, passwordHash],
    );

    const user = result.rows[0];

    if (!user) {
        return response.status(409).json({
            message: "Этот username уже занят",
        });
    }

    response.status(201).json({
        message: "Аккаунт создан",
        user,
    });
});

authRouter.post("/login", async (request, response) => {
    const { username, password } = request.body;

    if (typeof username !== "string" || typeof password !== "string") {
        return response.status(400).json({
            message: "Логин и пароль должны быть стркоами",
        });
    }

    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername || !password) {
        return response.status(400).json({
            message: "Логин и пароль обязательны",
        });
    }

    const result = await db.query(
        `SELECT id, name, username, password_hash
        FROM users
        WHERE username = $1`,
        [normalizedUsername],
    );

    const user = result.rows[0];

    if (!user) {
        return response.status(401).json({
            message: "Неверный username или пароль",
        });
    }

    const isPasswordValid = await argon2.verify(
        user.password_hash,
        password,
    );

    if (!isPasswordValid) {
        return response.status(401).json({
            message: "Неверный username или пароль",
        });
    }

    const sessionToken = randomBytes(32).toString("base64url");
    const sessionTokenHash = await argon2.hash(sessionToken);

    const sessionExpiresAt = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30,
    );

    await db.query(
        `INSERT INTO sessions (
            user_id,
            token_hash,
            expires_at,
            ip,
            user_agent
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
            user.id,
            sessionTokenHash,
            sessionExpiresAt,
            request.ip ?? null,
            request.get("user-agent") ?? null,
        ],
    );

    response.cookie("session_token", sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        expires: sessionExpiresAt,
    });

        response.json({
            message: "Пароль верный",
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
            },
        });
    });
