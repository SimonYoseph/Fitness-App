import { ResourceWithContent } from "@/components/resource-with-content";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PostDrawer, postDrawerIsOpenAtom } from "@/app/feed/post-drawer";
import { useAtom } from "jotai";
import { Feed } from "@/app/feed/feed";

export function HomeFeed() {
    return (
        <>
            <Separator/>
            <ResourceWithContent scrolling={false}>
                <div className="space-y-4">
                    
                    <div className="flex justify-between w-full">
                        <div>
                            <p className="text-3xl md:text-4xl font-bold">Public <span
                                className="text-primary animate-mask-flare-loop underline-effect relative">feed</span>
                            </p>
                            <p className="text-muted-foreground">
                                Share some content with other users!
                            </p>
                        </div>
                        
                        <div className="flex space-x-2">
                            <AddPostButton/>
                        
                        </div>
                    </div>
                    
                    <Separator/>
                    
                    <Feed/>
                
                </div>
            </ResourceWithContent>
        </>
    );
}

function AddPostButton() {
    
    const [open, setOpen] = useAtom(postDrawerIsOpenAtom);
    
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant={"default"}><BiPlus className="text-xl mr-2"/> New Post</Button>
            </SheetTrigger>
            <PostDrawer/>
        </Sheet>
    );
    
}