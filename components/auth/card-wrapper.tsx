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
    socialsLabel?: string; //Optional
    }

export const CardWrapper = ({children, headerLabel, backButtonLabel, backButtonHref, showSocials, socialsLabel}: CardWrapperProps) => {
    return (
        <Card className="md:w-[600px] shadow-md border-[rgba(107,217,251,0.5)] ">
            <CardHeader>
                <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">{headerLabel}</h2>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocials && (
                
                <CardFooter>
                    <Social
                        buttonLabel={socialsLabel || "Default Label"}
                    />
                </CardFooter>
             )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card> 
    )
}