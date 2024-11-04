"use client";

import { signin } from "../actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // enabling loading to disable submit button
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await signin(formData);
      console.log(result);
      if (!result.success) {
        // show the error message on the form
        setError(result.message || "An unexpected error occurred during sign-in");
      } else {
        if (result.totpDone) {
          router.push("/");
        } else {
          console.log('check-2fa');
          router.push("/check-2fa");
        }
      }
    } catch (error: unknown) {
      console.log(error);
      setError("An unexpected error occurred during sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="border rounded-lg border-stone-300 p-5">
        <p className="text-xl font-semibold mb-2">Login</p>
        <p className="text-sm text-neutral-60 mb-3">Enter your email below to login to your account</p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <p className="text-sm font-semibold mb-1.5">Email</p>
            <Input name="email" type="email" placeholder="Email" required />
          </div>
          <div>
            <div className="flex justify-between">
              <div>Password</div>
              <Link href={"/todo"} className="text-sm underline underline-offset-2">Forgot your password?</Link>
            </div>
            <Input name="password" type="password" placeholder="password" required />
          </div>
          <Button disabled={isLoading} className="mt-4 w-full">
            {isLoading && <p>Signing in</p>}
            {!isLoading && <p>Sign in</p>}
          </Button>
        </form>
        <div className="flex justify-center text-sm mt-4">
          <p className="mr-2">Don&apos;t have an accoutn?</p>
          <Link href="/sign-up" className="underline underline-offset-2">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
