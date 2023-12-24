"use client";
import "@/app/style/personal-records.css";
import { GiStrong } from "@react-icons/all-files/gi/GiStrong";
import { GiLeg } from "@react-icons/all-files/gi/GiLeg";
import { GiBodyBalance } from "@react-icons/all-files/gi/GiBodyBalance";
import { TfiStatsUp } from "react-icons/tfi";
import React, { memo, useMemo } from "react";
import { getUnitFromWorkoutItem, UpdateRecordPopover } from "@/app/progress/personal-records/update-record-popover";
import { GiRun } from "react-icons/gi";
import { ResourceWithContent } from "@/components/resource-with-content";
import { SimpleGrid } from "@/components/simple-grid";
import { Separator } from "@/components/ui/separator";
import { ListItem } from "@/components/list-item";
import { PageSection } from "@/components/page-section";
import { useUserPersonalRecords, useWorkoutItemsByCategory } from "@/lib/queries";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { BiPlus } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CurrentStats() {
    const { data: session } = useSession();
    const { data: records, isLoading } = useUserPersonalRecords(session?.user?.email);
    
    return (
        <div className="space-y-2">
            {(!!records?.length) && records.map((record) => (
                <ListItem
                    key={record.id}
                    action={
                        <Popover>
                            <PopoverTrigger asChild>
                                <div
                                    className="text-green-900 dark:text-green-200 font-bold py-2 px-4 rounded-2xl border animate-mask-flare-loop cursor-pointer">
                                    {record.value} {getUnitFromWorkoutItem(record.workout_item)}
                                </div>
                            </PopoverTrigger>
                            <UpdateRecordPopover workoutItem={record.workout_item} defaultValue={record.value}/>
                        </Popover>
                    }
                >
                    <div className="a-workout">
                        <p className="text-lg font-semibold">{record.workout_item.name}</p>
                    </div>
                </ListItem>
            ))}
            {(!isLoading && !records?.length) && <p>No personal records</p>}
        </div>
    );
    
}


export default function Page() {
    
    return (
        <div className="space-y-8">
            <SimpleGrid>
                <PageSection title="Check and update your personal records">
                    <div className="space-y-4">
                        <Separator/>
                        <ResourceWithContent
                            name={"Current Statistics"}
                            icon={TfiStatsUp}
                            scrolling={false}
                        >
                            <CurrentStats/>
                        </ResourceWithContent>
                    </div>
                </PageSection>
                
                <PageSection title="What record did you break today?">
                    <div className="space-y-4">
                        <Separator/>
                        <ScrollArea className="h-[60vh] w-full pr-4">
                            <WorkoutTypeLists/>
                        </ScrollArea>
                    </div>
                </PageSection>
            </SimpleGrid>
        </div>
    );
    
}


function WorkoutTypeLists() {
    
    const workoutTypes = useMemo(() => [
        {
            name: "Upper Body",
            list: <WorkoutTypeList category="upper-body"/>,
            icon: GiStrong,
        },
        {
            name: "Lower Body",
            list: <WorkoutTypeList category="lower-body"/>,
            icon: GiLeg,
        },
        {
            name: "Full Body",
            list: <WorkoutTypeList category="full-body"/>,
            icon: GiBodyBalance,
        },
        {
            name: "Cardio",
            list: <WorkoutTypeList category="cardio"/>,
            icon: GiRun,
        },
    ], []);
    
    return (
        <div className="space-y-4">
            {workoutTypes.map((workoutType) => (
                <ResourceWithContent
                    key={workoutType.name}
                    name={workoutType.name}
                    scrolling={false}
                    // icon={workoutType.icon}
                >
                    {workoutType.list}
                </ResourceWithContent>
            ))}
        </div>
    );
    
}

const WorkoutTypeList = memo(({ category }) => {
    
    // Get Workout items for the specific category
    const { data: workoutItems } = useWorkoutItemsByCategory(category);
    
    return (
        <div className="space-y-2">
            {workoutItems?.map((item) => (
                <ListItem
                    key={item.id}
                    action={<Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <BiPlus className="text-xl"/>
                            </Button>
                        </PopoverTrigger>
                        <UpdateRecordPopover workoutItem={item}/>
                    </Popover>}
                >
                    <div className="">
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="text-muted-foreground">{item.target}</p>
                    </div>
                </ListItem>
            ))}
        </div>
    );
    
});