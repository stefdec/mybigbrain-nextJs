"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@schemas";

import { useState, useTransition } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

import { CardWrapper } from "@components/auth/card-wrapper";
import { FormError } from "@components/auth/form-error";
import { registerUser } from "@lib/actions/auth/register";
import { redirect } from "next/navigation";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError('');
    
        startTransition(async () => {
            const result = await registerUser(values);
    
            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                // Redirect directly since you know it's successful
                redirect("/chatbot");
            }
    
        });
    };

    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/login"
            showSocials={true}
            socialsLabel="Sign up with Google"
        >

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                        <div className="space-y-4">
                            <FormField 
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">First Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                id="firstName"
                                                type="text"
                                                placeholder="Your first name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Last Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                id="lastName"
                                                type="text"
                                                placeholder="Your last name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Email Address</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                id="email"
                                                type="email"
                                                placeholder="Your email address"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                id="password"
                                                type="password"
                                                placeholder="********"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <Button 
                            type="submit" 
                            className="w-full button-shadow"
                            disabled={isPending}
                        >
                            
                            Register
                        </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
