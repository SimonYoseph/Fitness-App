"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Resource } from "@/components/resource";
import { ImUnlocked } from "react-icons/im";
import { GiNotebook, GiWeightScale } from "react-icons/gi";
import { SimpleGrid } from "@/components/simple-grid";
import { PageSection } from "@/components/page-section";


export default function () {
    const { data: session, status } = useSession();
    
    const resources = [
        {
            href: "/progress/personal-records",
            name: "Personal Records",
            description: "Keep track of all your PRs",
            icon: ImUnlocked,
        },
        {
            href: "/progress/caloric-intake",
            name: "Caloric Intake",
            description: "Track what you eat and your calories",
            icon: GiNotebook,
        },
        
        {
            href: "/progress/records",
            name: "Body Metrics",
            description:
                "Update and keep track of your height, weight, BMI, and more",
            icon: GiWeightScale,
        },
    ];
    
    if (status === "loading") return null;
    
    if (status === "authenticated") {
        
        return (
            <PageSection title="Track your progress">
                <SimpleGrid>
                    {resources.map((resource) => (
                        <Resource key={resource.href} resource={resource}/>
                    ))}
                </SimpleGrid>
            </PageSection>
        );
    }
}