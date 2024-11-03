"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "../actions/auth";
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
      const result = await signup(formData);
      if (!result.success) {
        // show the error message on the form
        setError(result.message || "An unexpected error occurred during signup");
      } else {
        // on successful sign-up redirect to sign-in page
        router.push("/sign-in");
      }
    } catch (error: unknown) {
      console.log(error);
      setError("An unexpected error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="border rounded-lg border-stone-300 p-5">
        <p className="text-xl font-semibold mb-2">Create an account</p>
        <p className="text-sm text-neutral-60 mb-3">Enter your email below to login to your account</p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <p className="text-sm font-semibold mb-1.5">Email</p>
            <Input name="email" type="email" placeholder="Email" required />
          </div>
          <div className="mt-3">
            <div>Password</div>
            <Input name="password" type="Password" placeholder="password" required />
          </div>
          <Button disabled={isLoading} className="mt-4 w-full">Sign up</Button>
        </form>
        <div className="flex justify-center text-sm mt-4">
          <p className="mr-2">Already have an account?</p>
          <Link href="/sign-in" className="underline underline-offset-2">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
