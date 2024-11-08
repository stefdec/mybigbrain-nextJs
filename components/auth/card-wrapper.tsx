"use client"

import { Card,
    CardContent,
    CardFooter,
    CardHeader,
 } from "@components/ui/card";
import { Social } from "@components/auth/social";
import { BackButton } from "@components/auth/back-button";


interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocials?: boolean; //Optional
    }

export const CardWrapper = ({children, headerLabel, backButtonLabel, backButtonHref, showSocials}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md border-[rgba(107,217,251,0.5)] ">
            <CardHeader>
                <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">{headerLabel}</h2>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocials && (
                
                <CardFooter>
                    <Social
                        buttonLabel="Sign in with Google"
                    />
                </CardFooter>
             )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card> 
    )
}