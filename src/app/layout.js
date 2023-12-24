import "./style/globals.css";
import { ClientProviders } from "@/components/client-providers";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});
export const metadata = {
    title: "Fitness App",
    description: "Fitness App Group Project",
};

export default function RootLayout({ children }) {
    
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
                suppressHydrationWarning
            >
                <div
                    className="fixed w-full h-full bg-no-repeat bg-cover bg-center -z-10 opacity-100 dark:opacity-90 animate-mask-flare-loop"
                    style={{
                        backgroundImage: "url(/images/effect.png)",
                    }}
                />
                <svg
                    className="absolute opacity-0  dark:opacity-20 inset-0 -z-10 h-full w-full stroke-gray-700 [mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                            width={200}
                            height={200}
                            x="90%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none"/>
                        </pattern>
                    </defs>
                    <svg x="90%" y={-1} className="overflow-visible fill-card">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"/>
                </svg>
                <ClientProviders>
                    <div className="container max-w-6xl pt-16 space-y-4 pb-16">
                        {children}
                    </div>
                </ClientProviders>
                <div
                    className="dumbbell w-full flex fixed bottom-0 justify-around items-center select-none pointer-events-none">
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px]"/>
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px]"/>
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px]"/>
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>
                    {/*<img src="images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>*/}
                    {/*<img src="images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>*/}
                    {/*<img src="images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>*/}
                    {/*<img src="images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>*/}
                    {/*<img src="images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>*/}
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px] hidden md:block"/>
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px]"/>
                    <img src="/images/dumbbell.png" className="rotate-12 w-[20px] md:w-[50px]"/>
                </div>
            </body>
        </html>
    );
}