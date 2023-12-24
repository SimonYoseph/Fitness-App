"use client";
import React, { useEffect } from "react";
import "@/app/style/update-records.css";
import { PopoverContent } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpsertPersonalRecord } from "@/lib/queries";

const formSchema = z.object({
    value: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v > 0, "Value must be greater than 0."),
});

export function UpdateRecordPopover({ workoutItem, defaultValue }) {
    const { data: session } = useSession();
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: defaultValue ? String(defaultValue) : "0",
        },
    });
    
    const { mutate: upsertRecord, isPending, isSuccess } = useUpsertPersonalRecord();
    
    useEffect(() => {
        if (isSuccess) {
            form.reset();
        }
    }, [isSuccess]);
    
    function onSubmit(values) {
        if (session?.user?.email) {
            upsertRecord({
                user_id: session?.user?.email,
                workout_item_id: workoutItem.id,
                value: values.value,
            });
        }
    }
    
    return (
        <PopoverContent className="w-96">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">{workoutItem.name} PR</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} type="number"/>
                                </FormControl>
                                <FormDescription>
                                    How many {getUnitFromWorkoutItem(workoutItem)}?
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending}>Save</Button>
                </form>
            </Form>
        </PopoverContent>
    );
}

export function getUnitFromWorkoutItem(workoutItem) {
    if (workoutItem.name === "Plank")
        return "minutes";
    if (workoutItem.name === "Deadlift")
        return "lbs";
    if (workoutItem.name === "Bench Press")
        return "lbs";
    if (workoutItem.name === "Leg Press")
        return "lbs";
    switch (workoutItem.category) {
        case "cardio":
            return "miles";
        case "full-body":
            return "reps";
        default :
            return "reps";
    }
    
}