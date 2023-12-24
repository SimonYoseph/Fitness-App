import { useDeletePost, useFeed, useLikePost, useUnLikePost } from "@/lib/queries";
import { useSession } from "next-auth/react";
import { Timeline } from "@/components/timeline";
import TimelineItem from "@/components/timeline/TimeLineItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { GiRun } from "react-icons/gi";
import { BiMedal, BiX } from "react-icons/bi";
import { getUnitFromWorkoutItem } from "@/app/progress/personal-records/update-record-popover";
import { FeedResource } from "@/components/resource-with-content";
import React, { useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { cn } from "@/lib/utils";

export function Feed() {
    
    const { data: session, status } = useSession();
    
    const { data: feed, isLoading } = useFeed(session?.user?.email);
    const { mutate: deletePost, isPending } = useDeletePost();
    
    
    return (
        <>
            {isLoading && <p>Loading...</p>}
            {!isLoading && !!feed?.length && (
                <>
                    <div className="max-w-[700px]">
                        <Timeline>
                            {feed?.map((post) => {
                                return (
                                    <FeedItem key={post.id} post={post}/>
                                );
                            })}
                        </Timeline>
                    </div>
                </>
            )}
            {!isLoading && !feed?.length && <p>No posts yet.</p>}
        </>
    );
    
}

function FeedItem({ post }) {
    
    const { data: session, status } = useSession();
    
    const type = useMemo(() => post.record ? "pr" : "workout", [post.record]);
    const item = useMemo(() => post.item, [post.item]);
    
    const [liked, setLiked] = React.useState(post.likes.length > 0);
    const [likes, setLikes] = React.useState(post.likes_aggregate?.aggregate?.count);
    
    useEffect(() => {
        setLiked(post.likes.length > 0);
    }, [post.likes.length]);
    
    useEffect(() => {
        setLikes(post.likes_aggregate?.aggregate?.count);
    }, [post.likes_aggregate?.aggregate?.count]);
    
    const { mutate: deletePost, isPending } = useDeletePost();
    const { mutate: likePost, isPending: isLiking } = useLikePost({
        onSuccess: () => {
            setLiked(true);
            setLikes(prev => prev + 1);
        },
    });
    const { mutate: unlikePost, isPending: isUnliking } = useUnLikePost({
        onSuccess: () => {
            setLiked(false);
            setLikes(prev => prev - 1);
        },
    });
    
    const handleLike = () => {
        if (liked) {
            unlikePost({ postId: post.id, userId: session?.user?.email });
        } else {
            likePost({ post_id: post.id, user_id: session?.user?.email });
        }
    };
    
    return (
        <TimelineItem
            media={
                <Avatar className="h-9 w-9">
                    <AvatarImage src={post.account.picture} alt={post.account.name}/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            }
        >
            
            <div className="absolute top-0 right-2 flex gap-2">
                
                {(
                    <div className="flex items-center gap-2 bg-secondary rounded-md pl-3">
                        <p className="text-lg font-bold">{likes}</p>
                        <Button
                            size="icon"
                            variant="secondary"
                            className={cn(
                                "text-gray-500",
                                { "text-rose-600": post.user_id !== session?.user?.email },
                            )}
                            disabled={post.user_id === session?.user?.email || isLiking || isUnliking}
                            onClick={handleLike}
                        >
                            {(liked > 0 || post.user_id === session?.user?.email) ?
                                <AiFillHeart className="text-2xl"/> :
                                <AiOutlineHeart className="text-2xl"/>}
                        </Button>
                    </div>
                )}
                
                {/*LIKE OR DELETE*/}
                {post.user_id === session?.user?.email && (
                    <>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="icon" variant="secondary" className="">
                                    <BiX className="text-xl"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="flex flex-col gap-2 p-4">
                                    <p className="text-lg font-semibold">Delete this
                                        post?</p>
                                    <p className="text-sm text-gray-500">This action cannot
                                        be
                                        undone.</p>
                                    <div className="flex gap-2">
                                        <Button variant="destructive" size="sm"
                                                disabled={isPending}
                                                onClick={() => deletePost({ id: post.id })}>Delete</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </>
                )}
            
            
            </div>
            
            <p className="my-1 flex items-center max-w-[75%] flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.account.name}
                </span>
                <span className="mx-2">posted about a </span>
                <span className="font-semibold text-orange-500 dark:text-orange-500">
                    {!!post.record ? "personal record" : "workout"}
                </span>
                <span
                    className="ml-3 rtl:mr-3">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </p>
            <div className="text-lg font-semibold mt-4">
                {post.name}
            </div>
            <div className="mt-4">
                {!!item && <FeedResource
                    nameClassName="text-xl md:text-xl font-semibold line-clamp-1"
                    scrolling={false}
                    name={`${type === "workout" ? item.name : `${item.workout_item.name} for ${item.value} ${getUnitFromWorkoutItem(item.workout_item)}`}`}
                    icon={type === "workout" ? GiRun : BiMedal}
                >
                    <div className="space-y-4 p-4 pt-0">
                        {type === "workout" && (
                            <>
                                <p>{post.content}</p>
                                <Separator/>
                                <ul
                                    className="list-disc list-inside"
                                >{item.user_workout_items.map(userWorkoutItem =>
                                    <li key={userWorkoutItem.id}>{userWorkoutItem.workout_item.name}</li>)}
                                </ul>
                            </>
                        )}
                        {type === "pr" && (
                            <p>{post.content}</p>
                        )}
                    </div>
                </FeedResource>}
            </div>
        </TimelineItem>
    );
    
}