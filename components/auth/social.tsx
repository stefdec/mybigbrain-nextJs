"use client"

import { FcGoogle } from "react-icons/fc";
import { Button } from "@components/ui/button";

interface SocialProps {
    buttonLabel: string;
    }

export const Social = ({buttonLabel}: SocialProps) => {
    return (
        <div className="flex flex-col items-center w-full gap-x-2">
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            <Button
                size="lg"
                className="text-sm text-gray-500 w-full"
                variant={"outline"}
                onClick={() => {}}
            >
                <FcGoogle />
                <span>{buttonLabel}</span>
            </Button>
        </div>
    )
}