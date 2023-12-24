"use client";

export default function () {
    
    return (
        <div className="container max-w-6xl pt-16 space-y-4">
            <p className="text-3xl md:text-4xl font-bold">About Us</p>
            <p className="text-1.5xl md:text-2xl">Our mission is to make your fitness journey as
                simple as possible. We provide you with a list of
                workouts and methods that will help you achieve your
                fitness goals. You will be able to track your steps,
                calories and the personal records you're bound to achieve.
                We want you to look, feel, and be the person you truly want to be.
                This app will <span className="font-bold">undoubtedly</span> take you there!</p>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: "53vh",
            }}>
                <p className="text-3xl md:text-2xl font-bold">Developed By:</p>
                <a href="https://github.com/zbonfo" className="text-base transition-colors hover:text-primary">Zaki Bonfoh</a>
                <a href="https://github.com/subilawal" className="text-base transition-colors hover:text-primary">Olasubomi Lawal</a>
                <a href="https://github.com/MATHEWMESFIN" className="text-base transition-colors hover:text-primary">Mathew Mesfin</a>
                <a href="https://github.com/joguns1" className="text-base transition-colors hover:text-primary">Joshua Ogunsola</a>
                <a href="https://github.com/JephtahOpoku" className="text-base transition-colors hover:text-primary">Jephtah Opoku</a>
                <a href="https://github.com/SimonYoseph" className="text-base transition-colors hover:text-primary">Simon Yoseph</a><br></br>
                <img style={{ height: 50, textAlign: "center" }} src="/icon.png" alt="MyFit Icon"></img>
            </div>
        </div>
    );
    
}