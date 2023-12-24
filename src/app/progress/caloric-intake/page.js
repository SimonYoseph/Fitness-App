"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { PageSection } from "@/components/page-section";
import { z } from "zod";
import { useCaloricIntakes, useDeleteCaloricIntake, useInsertCaloricIntake } from "@/lib/queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResourceWithContent } from "@/components/resource-with-content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/spinner";
import { ListItem } from "@/components/list-item";
import { BiCalendarAlt, BiX } from "react-icons/bi";
import toast from "react-hot-toast";
import { DailyCaloricSummary } from "@/app/progress/caloric-intake/summary";

export default function Page() {
    const { data: session, status } = useSession();
    
    const { data: caloricIntakes, isLoading } = useCaloricIntakes(session?.user?.email);
    
    const { mutate: deleteCaloricIntake, isPending } = useDeleteCaloricIntake();
    
    function handleDelete(id) {
        deleteCaloricIntake({ id });
    }
    
    if (status === "loading") return null;
    
    return (
        <PageSection title="Caloric Intakes">
            <div className="space-y-8">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <ResourceWithContent contentClassName="max-h-[21rem]">
                        {/* Loading */}
                        {isLoading && <Spinner className="h-4 w-4 animate-spin"/>}
                        
                        {/* List of caloric intakes */}
                        {!isLoading && !!caloricIntakes?.length && (
                            <div className="space-y-2">
                                {caloricIntakes?.map(item => (
                                    <ListItem key={item.id}>
                                        <p className="text-base font-bold text-orange-600 dark:text-orange-200 mb-4 flex gap-2 items-center">
                                            <BiCalendarAlt/>
                                            <span>{format(new Date(item.date), "PPP")}</span>
                                        </p>
                                        
                                        <div className="flex gap-4 text-md">
                                            <div className="">
                                                <div>
                                                    <p className="font-semibold">Food item:</p>
                                                    <p>{item.name}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="font-semibold">Calories:</p>
                                                    <p>{item.calories}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="absolute top-2 right-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <BiX className="text-2xl"/>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <div className="flex flex-col gap-2 p-4">
                                                        <p className="text-lg font-semibold">Delete caloric intake?</p>
                                                        <p className="text-sm text-gray-500">This action cannot be
                                                            undone.</p>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={isPending}
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </ListItem>
                                ))}
                            </div>
                        )}
                        
                        {/* Empty */}
                        {!isLoading && !!caloricIntakes && caloricIntakes.length === 0 && (
                            <div className="text-center">You have not recorded any caloric intakes.</div>
                        )}
                    </ResourceWithContent>
                    
                    <DailyCaloricSummary caloricIntakes={caloricIntakes}/>
                
                </div>
                
                
                <Separator/>
                
                <CaloricIntakesForm/>
                
                <Separator/>
                
                <DailyCaloricGoalForm/>
            </div>
        </PageSection>
    );
}

const formSchema = z.object({
    name: z.string(),
    calories: z
        .string()
        .transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v > 0, "Value must be greater than 0."),
});

export function CaloricIntakesForm() {
    const { data: session } = useSession();
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    
    const { mutate, isPending, status } = useInsertCaloricIntake({
        onSuccess: () => {
            form.reset();
        },
    });
    
    function onSubmit(values) {
        if (session?.user?.email) {
            mutate({
                ...values,
                user_id: session?.user?.email,
                date: new Date(),
            });
        }
    }
    
    return (
        <ResourceWithContent scrolling={false} bodyClassName="p-0">
            <Accordion type="single" collapsible>
                <AccordionItem value="caloric-intakes" label="Caloric Intakes">
                    <AccordionTrigger className="p-4">Add caloric intake</AccordionTrigger>
                    <AccordionContent className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Food item</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="calories"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Calories</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="capture-button" disabled={isPending}>
                                    Add
                                </Button>
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ResourceWithContent>
    );
}

export function DailyCaloricGoalForm() {
    const { data: session } = useSession();
    
    // Retrieve the saved daily caloric goal from local storage
    const storedGoal = localStorage.getItem("dailyCaloricGoal");
    const defaultGoal = storedGoal ? parseInt(storedGoal) : 0;
    
    const form = useForm({
        defaultValues: {
            goal: defaultGoal,
        },
    });
    
    function onSubmit(values) {
        // Save the updated goal to local storage
        localStorage.setItem("dailyCaloricGoal", values.goal.toString());
        toast.success("Daily caloric goal updated.");
        
        const event = new Event("storageChange");
        event.key = "dailyCaloricGoal";
        window.dispatchEvent(event);
    }
    
    return (
        <ResourceWithContent scrolling={false} bodyClassName="p-0">
            <Accordion type="single" collapsible>
                <AccordionItem value="daily-caloric-goal" label="Daily Caloric Goal">
                    <AccordionTrigger className="p-4">Update Your Daily Caloric Goal</AccordionTrigger>
                    <AccordionContent className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="goal"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Goal</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="capture-button">
                                    Update Daily Caloric Goal
                                </Button>
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ResourceWithContent>
    );
}