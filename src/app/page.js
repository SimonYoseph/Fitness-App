"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiBarChart } from "@react-icons/all-files/fi/FiBarChart";
import { FiDribbble } from "@react-icons/all-files/fi/FiDribbble";
import { Resource } from "@/components/resource";
import { SimpleGrid } from "@/components/simple-grid";
import { HomeFeed } from "@/app/feed/home-feed";

export default function () {
    
    const { data: session, status } = useSession();
    const firstName = session?.user?.name?.split(" ")?.[0];
    
    if (status === "loading") return null;
    
    if (status === "unauthenticated") {
        
        return (
            <>
                <p className="text-5xl md:text-8xl font-bold">Welcome to <span
                    className="text-primary animate-mask-flare-loop underline-effect relative">MyFIT</span></p>
                <p className="text-xl md:text-3xl text-muted-foreground">Your personal fitness tracker.</p>
                <Link href="/login" className="inline-block">
                    <Button size="lg" className="text-xl bg-white text-black hover:text-white">Get
                        started {`->`}</Button>
                </Link>
            </>
        );
    } else {
        return (<>
                <p className="text-3xl md:text-4xl font-bold">Welcome back, <span
                    className="text-primary">{firstName}</span></p>
                <HomePageResources/>
                <HomeFeed/>
            </>
        );
    }
}

const resources = [
    {
        href: "/progress",
        name: "Progress",
        description:
            "Track your daily calories and personal fitness goals.",
        icon: FiBarChart,
    },
    {
        href: "/workout",
        name: "Workout",
        description:
            "Create and track your workouts.",
        icon: FiDribbble,
    },
];

function HomePageResources() {
    return (
        <div className="my-16 xl:max-w-[80rem]">
            <div>
                What would you like to do today?
            </div>
            <SimpleGrid>
                {resources.map((resource) => (
                    <Resource key={resource.href} resource={resource}/>
                ))}
            </SimpleGrid>
        </div>
    );
}