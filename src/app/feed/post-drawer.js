import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { ResourceWithContent } from "@/components/resource-with-content";
import { GiRun } from "react-icons/gi";
import { BiMedal } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useCreatePost, useUserPersonalRecords, useUserWorkouts } from "@/lib/queries";
import { FiArrowLeft } from "react-icons/fi";
import { ListItem } from "@/components/list-item";
import { getUnitFromWorkoutItem } from "@/app/progress/personal-records/update-record-popover";
import { Separator } from "@/components/ui/separator";
import { atom, useAtom } from "jotai";
import toast from "react-hot-toast";

const typeAtom = atom(null);
const itemAtom = atom(null);
const titleAtom = atom("");
const captionAtom = atom("");

export const postDrawerIsOpenAtom = atom(false);

export function PostDrawer() {
    
    const { data: session, status } = useSession();
    
    if (status === "unauthenticated") return null;
    
    return (
        <SheetContent className="w-[400px] sm:w-[800px] sm:max-w-7xl bg-card">
            <SheetHeader>
                <SheetTitle>New Post</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
                <TitleForm/>
                <div className="space-y-4">
                    <Label htmlFor="content" className="text-lg">
                        Share some content
                    </Label>
                    <ShareContentForm/>
                </div>
            </div>
            <SheetFooter>
                <SubmitPostForm/>
            </SheetFooter>
        </SheetContent>
    );
}

function SubmitPostForm() {
    
    const { data: session, status } = useSession();
    
    const [open, setOpen] = useAtom(postDrawerIsOpenAtom);
    
    const [title, setTitle] = useAtom(titleAtom);
    const [caption, setCaption] = useAtom(captionAtom);
    const [type, setType] = useAtom(typeAtom);
    const [item, setItem] = useAtom(itemAtom);
    
    const { mutate, isPending, isSuccess } = useCreatePost({
        onSuccess: () => {
            setTitle("");
            setCaption("");
            setType(null);
            setItem(null);
            setOpen(false);
        },
    });
    
    function handleSubmit() {
        if (title === "") {
            toast.error("Please enter a title");
            return;
        }
        if (caption === "") {
            toast.error("Please enter a title");
            return;
        }
        mutate({
            name: title,
            content: caption,
            user_id: session?.user?.email,
            record_id: type === "pr" ? item?.id : null,
            user_workout_id: type === "workout" ? item?.id : null,
            item: item,
        });
    }
    
    return (
        <>
            <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isPending || isSuccess || title === "" || caption === "" || type === null || item === null}
            >Publish</Button>
        </>
    );
    
}

function TitleForm() {
    
    const [title, setTitle] = useAtom(titleAtom);
    const [type, setType] = useAtom(typeAtom);
    const [item, setItem] = useAtom(itemAtom);
    const [autoSetTitle, setAutoSetTitle] = useState(true);
    
    useEffect(() => {
        if (type !== null && item !== null && title === "" && autoSetTitle) {
            let title = "";
            if (type === "workout") {
                title = "My workout: " + item.name;
            } else if (type === "pr") {
                title = "I just set a new personal record!";
            }
            setTitle(title);
            setAutoSetTitle(false);
        }
    }, [title, type, item, autoSetTitle]);
    
    useEffect(() => {
        if (type === null && item === null && title === "" && !autoSetTitle) {
            setAutoSetTitle(true);
        }
    }, [title, type, item, autoSetTitle]);
    
    return (
        <div className="flex gap-4 items-center">
            <Label htmlFor="title" className="text-lg flex-none">
                Title
            </Label>
            <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full"/>
        </div>
    );
}

function ShareContentForm() {
    
    const { data: session, status } = useSession();
    
    const [type, setType] = useAtom(typeAtom);
    const [item, setItem] = useAtom(itemAtom);
    const [caption, setCaption] = useAtom(captionAtom);
    
    // Fetch the user's workouts
    const { data: userWorkouts, isLoading } = useUserWorkouts(session?.user?.email);
    const { data: records, isLoading2 } = useUserPersonalRecords(session?.user?.email);
    
    function handleBack() {
        setType(null);
        setItem(null);
    }
    
    return (
        <>
            
            {type === null && (
                <div className="grid grid-cols-2 gap-4">
                    <>
                        <ResourceWithContent
                            className="cursor-pointer"
                            nameClassName="text-xl md:text-xl font-bold group-hover:text-orange-500 group-hover:dark:text-orange-500"
                            name="Share a Workout"
                            icon={GiRun}
                            onClick={() => setType("workout")}
                        />
                        <ResourceWithContent
                            className="cursor-pointer"
                            nameClassName="text-xl md:text-xl font-bold group-hover:text-orange-500 group-hover:dark:text-orange-500"
                            name="Share a Personal Record"
                            icon={BiMedal}
                            onClick={() => setType("pr")}
                        />
                    </>
                </div>
            )}
            
            {type !== null && (
                <>
                    <div className="flex items-center gap-4 text-lg font-semibold">
                        <Button variant="outline" onClick={handleBack}><FiArrowLeft
                            className="mr-2"/> Back</Button>
                        <p>
                            {type === "workout" && "Share a workout"}
                            {type === "pr" && "Share a personal record"}
                        </p>
                    </div>
                    
                    {item === null && (
                        <>
                            {type === "workout" && (
                                <p>Select the workout you want to share</p>
                            )}
                            {type === "pr" && (
                                <p>Select the personal record you want to share</p>
                            )}
                            
                            <ResourceWithContent>
                                
                                {type === "workout" && (
                                    <>
                                        <div className="space-y-4">
                                            {userWorkouts?.map(uw => (
                                                <ListItem
                                                    key={uw.id}
                                                    className="cursor-pointer ring-inset hover:ring-2 ring-orange-500 transition"
                                                    onClick={() => setItem(uw)}
                                                >
                                                    <p className="text-xl font-bold text-orange-600 dark:text-orange-200">{uw.name}</p>
                                                    <p>{uw.user_workout_items.map(userWorkoutItem => userWorkoutItem.workout_item.name).join(", ")}</p>
                                                </ListItem>
                                            ))}
                                            {(!isLoading && !!userWorkouts && userWorkouts.length === 0) && <div>
                                                You do not have any workouts.
                                            </div>}
                                        </div>
                                    </>
                                )}
                                
                                {type === "pr" && (
                                    <>
                                        <div className="space-y-4">
                                            {(!!records?.length) && records.map((record) => (
                                                <ListItem
                                                    key={record.id}
                                                    action={
                                                        <div
                                                            className="text-green-900 dark:text-green-200 font-bold py-2 px-4 rounded-2xl border animate-mask-flare-loop cursor-pointer">
                                                            {record.value} {getUnitFromWorkoutItem(record.workout_item)}
                                                        </div>
                                                    }
                                                    className="cursor-pointer ring-inset hover:ring-2 ring-orange-500 transition"
                                                    onClick={() => setItem(record)}
                                                >
                                                    <div className="a-workout">
                                                        <p className="text-lg font-semibold">{record.workout_item.name}</p>
                                                    </div>
                                                </ListItem>
                                            ))}
                                            {(!isLoading2 && !records?.length) &&
                                                <p>You do not have any personal records</p>}
                                        </div>
                                    </>
                                )}
                            
                            </ResourceWithContent>
                        
                        </>
                    )}
                    
                    {item !== null && (
                        <>
                            <ResourceWithContent
                                nameClassName="text-xl md:text-xl font-medium"
                                scrolling={false}
                                name={`Sharing: ${type === "workout" ? item.name : `${item.workout_item.name}`}`}
                                icon={type === "workout" ? GiRun : BiMedal}
                            >
                                <div className="space-y-4 p-4 pt-0">
                                    {type === "workout" && (
                                        <ul>{item.user_workout_items.map(userWorkoutItem =>
                                            <li key={userWorkoutItem.id}>{userWorkoutItem.workout_item.name}</li>)}</ul>
                                    )}
                                    {type === "pr" && (
                                        <p>{`${item.value} ${getUnitFromWorkoutItem(item.workout_item)}`}</p>
                                    )}
                                    <Separator/>
                                    <div className="space-y-4">
                                        <Label htmlFor="name" className="text-lg">
                                            Write a caption
                                        </Label>
                                        <Textarea
                                            id="caption"
                                            value={caption}
                                            onChange={e => setCaption(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                            </ResourceWithContent>
                        </>
                    )}
                
                </>
            )}
        
        </>
    );
    
    
}