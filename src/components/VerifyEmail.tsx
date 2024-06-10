'use client'

import { trpc } from "@/trpc/client"
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
    token: string;
}

const VerifyEmail = ({token}: VerifyEmailProps) => {
    const {data, isLoading, isError} = trpc.auth.verifyEmail.useQuery({
        token
    })


    if(isError) {
        return <div className="flex flex-col justify-center items-center gap-2"> 
        <XCircle className="h-8 w-8 text-red-600"/>
        <h3 className="font-semibold text-xl">there was a problem</h3>
        <p className="text-muted-foreground text-sm">
            this either an invalid token or an expired token
        </p>
        </div>
    }

    if(data?.success) {
        return (
            <div className="flex h-full flex-col items-center justify-center ">
                <div className="relative mb-4 h-60 w-60 text-muted-foreground">
                <Image src='/Prime-Email-Verified.png' fill alt="Email was Sent"/>
                </div>

                <h3 className="font-semibold text-2xl"> You&apos;re all set!</h3>
                <p className="text-muted-foreground text-center mt-1">Thank You for verifying your Email</p>
                <Link href='/sign-in' className={buttonVariants({className: 'mt-4'})}>Sign In</Link>
            </div>
        )
    }

    if(isLoading) {
        return (
            <div className="flex flex-col justify-center items-center gap-2"> 
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300"/>
        <h3 className="font-semibold text-xl">Verifying....</h3>
        <p className="text-muted-foreground text-sm">
            this won&apos;t take log please be patient
        </p>
        </div>
        )
    }
  
}

export default VerifyEmail
