"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { totpCheck } from "../actions/totp";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const res = totpCheck(formData.get("token")?.toString());
    console.log(res);

    setIsLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input name="token" placeholder="Enter 6 digit number TOTP code" />
        <Button disabled={isLoading} className="mt-4 w-full">
          {isLoading && <p>Submitting</p>}
          {!isLoading && <p>Submit</p>}
        </Button>
      </form>
    </div>
  )
}