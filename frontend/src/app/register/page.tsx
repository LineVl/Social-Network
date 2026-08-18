"use client";

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
import { Button } from "../../components/ui/button";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {

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
            const response = await fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.get("name"),
                    username: formData.get("username"),
                    password: formData.get("password"),
                    passwordConfirmation: formData.get("passwordConfirmation"),
                }),
            });

            const data = await response.json();

            setIsError(!response.ok);
            setMessage(data.message);

            if (response.ok) {
                setIsError(false);
                setMessage("Аккаунт создан. Перенаправляем на страницу входа...");

                await new Promise((resolve) => window.setTimeout(resolve, 1200));

                router.replace("/login");
                return;
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
                    <CardTitle>Создать аккаунт</CardTitle>
                    <CardDescription>
                        Укажите данные для новой учётной записи.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">
                            Имя
                            </FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Введите имя"
                            />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Юзернейм"
                            />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Придумайте пароль"
                                    />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="passwordConfirmation">Повторите пароль</FieldLabel>
                                    <Input
                                        id="passwordConfirmation"
                                        name="passwordConfirmation"
                                        type="password"
                                        placeholder="Повторите пароль"
                                        />
                            </Field>
                        </FieldGroup>
                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Регистрируем..." : "Зарегистрировать аккаунт"}
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
                        После успешной регистрации вы будете перенесены на страницу {""}
                        <Link className="text-primary hover:underline" href="/login">
                       авторизации
                    </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}