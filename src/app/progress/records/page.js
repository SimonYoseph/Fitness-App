"use client";
import React, { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { PageSection } from "@/components/page-section";
import { z } from "zod";
import { useBodyMeasurements, useDeleteBodyMeasurements, useInsertBodyMeasurements } from "@/lib/queries";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResourceWithContent } from "@/components/resource-with-content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/spinner";
import { ListItem } from "@/components/list-item";
import { BiCalendarAlt, BiX } from "react-icons/bi";
import { MeasurementsGraph } from "@/app/progress/records/graph";


export default function Page() {
    const { data: session, status } = useSession();
    
    const { data: measurements, isLoading } = useBodyMeasurements(session?.user?.email);
    
    const { mutate: deleteBodyMeasurements, isPending } = useDeleteBodyMeasurements();
    
    function handleDelete(id) {
        deleteBodyMeasurements({ id });
    }
    
    const bodyMeasurementsData = useMemo(() => {
        return measurements?.map(item => ({
            "Weight": parseFloat(item.weight_pounds) + parseFloat(item.weight_ounces) / 16, // Combine pounds and ounces
            date: new Date(item.date).toISOString().split("T")[0],
        }))?.reverse();
    }, [measurements]);
    
    if (status === "loading") return null;
    
    return (
        <PageSection title="Body measurements">
            <div className="space-y-8">
                
                <MeasurementsGraph data={bodyMeasurementsData}/>
                
                <ResourceWithContent
                    contentClassName="max-h-[21rem]"
                >
                    {/*Loading*/}
                    {isLoading && <Spinner className="h-4 w-4 animate-spin"/>}
                    
                    {/*List of workouts*/}
                    {(!isLoading && !!measurements?.length) &&
                        <div className="space-y-2">
                            {measurements?.map(item => {
                                
                                const bmi = calculateBMI(parseFloat(item.weight_pounds), parseFloat(item.height_feet), parseFloat(item.height_inches)).toFixed(1);
                                let bmiCategory = "";
                                
                                if (bmi < 18.5) {
                                    bmiCategory = "Underweight";
                                } else if (bmi >= 18.5 && bmi <= 24.9) {
                                    bmiCategory = "Normal weight";
                                } else if (bmi >= 25 && bmi <= 29.9) {
                                    bmiCategory = "Overweight";
                                } else {
                                    bmiCategory = "Obesity";
                                }
                                
                                return (
                                    <ListItem key={item.id}>
                                        <p className="text-base font-bold text-orange-600 dark:text-orange-200 mb-4 flex gap-2 items-center">
                                            <BiCalendarAlt/>
                                            <span>{format(new Date(item.date), "PPP")}</span>
                                        </p>
                                        
                                        <div className="flex gap-4 text-md">
                                            <div className="">
                                                <div>
                                                    <p className="font-semibold">Weight:</p>
                                                    <p>{`${item.weight_pounds} pounds ${item.weight_ounces} ounces`}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="font-semibold">Height:</p>
                                                    <p>{`${item.height_feet} feet ${item.height_inches} inches`}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="">
                                                <div>
                                                    <p className="font-semibold">Waist Circumference:</p>
                                                    <p>{`${item.waist_circumference} inches`}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="font-semibold">Hip Circumference:</p>
                                                    <p>{`${item.hip_circumference} inches`}</p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <p className="font-semibold">BMI:</p>
                                                {/* Calculate BMI using the item data */}
                                                {item.weight_pounds && item.height_feet && item.height_inches &&
                                                    <p>{bmi}</p>
                                                }
                                                <p className="font-semibold">BMI Category:</p>
                                                {/* Calculate BMI using the item data */}
                                                {item.weight_pounds && item.height_feet && item.height_inches &&
                                                    <p>{bmiCategory}</p>
                                                }
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
                                                        <p className="text-lg font-semibold">Delete body
                                                            measurements?</p>
                                                        <p className="text-sm text-gray-500">This action cannot be
                                                            undone.</p>
                                                        <div className="flex gap-2">
                                                            <Button variant="destructive" size="sm" disabled={isPending}
                                                                    onClick={() => handleDelete(item.id)}>Delete</Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </ListItem>
                                );
                                
                            })}
                        </div>}
                    
                    {/*Empty*/}
                    {(!isLoading && !!measurements && measurements.length === 0) && <div>
                        You have not recorded any body measurements.
                    </div>}
                </ResourceWithContent>
                
                <Separator/>
                
                <BodyMeasurementsForm/>
            </div>
        </PageSection>
    );
    
}

function calculateBMI(weightPounds, heightFeet, heightInches) {
    const weightKg = weightPounds * 0.453592; // Convert pounds to kilograms
    const heightMeters = ((heightFeet * 12) + heightInches) * 0.0254; // Convert feet and inches to meters
    const bmi = weightKg / (heightMeters * heightMeters);
    return bmi;
}

const formSchema = z.object({
    date: z.date(),
    weight_pounds: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v > 0, "Value must be greater than 0."),
    weight_ounces: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v >= 0, "Value must be greater or equal to 0."),
    height_feet: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v > 0, "Value must be greater than 0."),
    height_inches: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v >= 0, "Value must be greater or equal to 0."),
    waist_circumference: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v > 0, "Value must be greater than 0."),
    hip_circumference: z.string().transform(v => parseInt(v))
        .refine(v => !isNaN(v), "Value must be a valid number.")
        .refine(v => v > 0, "Value must be greater than 0."),
});

export function BodyMeasurementsForm() {
    
    const { data: session } = useSession();
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    
    const { mutate, isPending, status } = useInsertBodyMeasurements({
        onSuccess: () => {
            form.reset();
        },
    });
    
    function onSubmit(values) {
        if (session?.user?.email) {
            mutate({
                ...values,
                user_id: session?.user?.email,
            });
        }
    }
    
    const Inputs = useCallback(() => {
        return <>
            <div className="flex gap-4 w-full">
                <FormField
                    control={form.control}
                    name="weight_pounds"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Weight (lbs):</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weight_ounces"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Weight (oz):</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="flex w-full gap-4">
                <FormField
                    control={form.control}
                    name="height_feet"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Height (feet):</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="height_inches"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Height (inches):</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="waist_circumference"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Waist Circumference (inches):</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="hip_circumference"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Hip Circumference (inches):</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </>;
    }, [status === "success"]);
    
    return (
        <ResourceWithContent scrolling={false} bodyClassName="p-0">
            <Accordion type="single" collapsible>
                <AccordionItem value="body-measurements" label="Body measurements">
                    <AccordionTrigger className="p-4">
                        Add measurements
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? (format(field.value, "PPP")) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Date of your measurements.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Inputs/>
                                <Button type="submit" className="capture-button" disabled={isPending}>
                                    Capture Body Measurements
                                </Button>
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ResourceWithContent>
    );
}