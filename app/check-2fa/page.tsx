"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { totpCheck } from "../actions/totp";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const res = await totpCheck(formData.get("token")?.toString());
    if (res) {
      router.push("/");
    } else {
      setError("wrong 6 digit code");
    }
    console.log(res);

    setIsLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input name="token" placeholder="Enter 6 digit number TOTP code" />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <Button disabled={isLoading} className="mt-4 w-full">
          {isLoading && <p>Submitting</p>}
          {!isLoading && <p>Submit</p>}
        </Button>
      </form>
    </div>
  )
}