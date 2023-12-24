"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function DailyCaloricSummary({ caloricIntakes }) {
    const { data: session } = useSession();
    
    // Retrieve the daily caloric goal from local storage
    const [storedGoal, setStoredGoal] = useState(localStorage.getItem("dailyCaloricGoal"));
    const dailyCaloricGoal = storedGoal ? parseInt(storedGoal) : 0;
    
    // Calculate the sum of calories for the caloric intakes added today
    const today = new Date().toLocaleDateString();
    const todaysCalories = caloricIntakes
        ? caloricIntakes.filter(item => new Date(item.date).toLocaleDateString() === today).reduce((acc, item) => acc + item.calories, 0)
        : 0;
    
    // Calculate the remaining calories
    const remainingCalories = dailyCaloricGoal - todaysCalories;
    const completionRate = dailyCaloricGoal === 0 ? 0 : (todaysCalories / dailyCaloricGoal) * 100;
    
    useEffect(() => {
        setStoredGoal(localStorage.getItem("dailyCaloricGoal"));
        
        const handleStorageChange = (event) => {
            setStoredGoal(localStorage.getItem("dailyCaloricGoal"));
        };
        
        window.addEventListener("storageChange", handleStorageChange);
        
        return () => {
            window.removeEventListener("storageChange", handleStorageChange);
        };
    }, []);
    
    return (
        <div className="flex flex-col items-center">
            <div className="text-lg font-semibold mb-4">
                {dailyCaloricGoal === 0
                    ? "No caloric goal set."
                    : `Remaining calories for today: ${remainingCalories}`}
            </div>
            <CircularProgressBar completion={completionRate} remainingCalories={remainingCalories}
                                 dailyCaloricGoal={dailyCaloricGoal}/>
        </div>
    );
}

function CircularProgressBar({ completion, remainingCalories, dailyCaloricGoal }) {
    return (
        <div className="relative w-40 h-40">
            <svg viewBox="0 0 36 36" className="absolute">
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="transparent"
                    // stroke="#e0e0e0"
                    strokeWidth="4"
                    className="stroke-gray-300 dark:stroke-gray-800"
                />
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="transparent"
                    strokeWidth="4"
                    strokeDasharray={`${completion} 100`}
                    transform="rotate(-90 18 18)"
                    className="stroke-primary dark:stroke-primary-300"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="text-lg font-semibold">{dailyCaloricGoal - remainingCalories} / {dailyCaloricGoal}</span>
            </div>
        </div>
    );
}