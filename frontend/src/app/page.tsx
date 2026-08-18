import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
export default function Home() {
    return (
        <main>
            <header className="border-b border-border">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <p className="text-xl font-bold text-primary">Сеть</p>

                    <div className="flex gap-6">
                    <p>Лента</p>
                        <p>Профиль</p>
                    </div>

                    <Button variant="outline">Выйти</Button>
                </nav>
            </header>
            <section className="mx-auto max-w-5xl px-6 py-8">
                <h1 className="text-2xl font-bold">Лента</h1>
                <Textarea
                    className="mt-6"
                    placeholder="Что у вас нового?" />
                <div className="mt-3 flex w-full justify-end">
                <Button>Опубликовать</Button>
                </div>
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Владислав</CardTitle>
                        <CardDescription>@vladislav | только что</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>И так, вы решили стать пилотом...</p>
                    </CardContent>
                    <CardFooter>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm">0 лайков</Button>
                            <Button variant="ghost" size="sm">0 комментариев</Button>
                        </div>
                    </CardFooter>
                </Card>
            </section>
            </main>
    );
}