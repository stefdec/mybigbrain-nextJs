"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@schemas";

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
import { FormError } from "@components/pub/form-error";
import { login } from "@lib/actions/auth/login";
import { resolve } from "path";
import { redirect } from "next/navigation";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();


    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');

        startTransition( async () => {
            await login(values)
            .then((result) => {
                setError(result.error);
                setSuccess(result.success);
            });

            if (success) {
                redirect("/chatbot");
            }
        });
        
        

    }

    return (
        <CardWrapper
            headerLabel="Welcome back!"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocials={true}
            socialsLabel="Sign in with Google"
        >

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                        <div className="space-y-4">
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
                            className="w-full shadow-[-10px_0_15px_1px_rgba(107,217,251,0.3),0_0_15px_1px_rgba(99,145,255,0.3),10px_0_15px_1px_rgba(125,80,255,0.3)]"
                            disabled={isPending}
                        >
                            Login
                        </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
