"use client";

import Link from "next/link";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.get("username"),
                    password: formData.get("password"),
                }),
            });

            const data = await response.json();

            setIsError(!response.ok);
            setMessage(data.message);

            if (response.ok) {
                router.replace("/");
            }
        } catch {
            setIsError(true);
            setMessage("Не удалось связаться с сервером");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
            <CardHeader>
                    <CardTitle>Вход в Сеть</CardTitle>
                    <CardDescription>
                    Введите логин и пароль, чтобы продолжить.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="login">Логин или username</FieldLabel>
                            <Input
                                id="login"
                                name="username"
                                placeholder="@vladislav"
                        />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                                <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Введите пароль"
                            />
                            </Field>
                        </FieldGroup>
                        <Button className="w-full" type="submit">
                            Войти
                        </Button>
                        {message ? (
                            <p className={isError ? "text-sm text-destructive" : "text-sm text-green-500"}>
                                {message}
                            </p>
                        ) : null}
                        </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        Нет аккаунта?{" "}
                        <Link className="text-primary hover:underline" href="/register">
                        Зарегистрироваться
                        </Link>
                    </p>
                </CardFooter>
        </Card>
        </main>
    );
}