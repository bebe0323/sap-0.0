"use client";

import { TypeUserClient } from "@/app/types/user";
import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch"

export default function TwoFactorForm({user}: {user: TypeUserClient}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [faChecked, setFaChecked] = useState<boolean>(user.totpEnabled);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    console.log(faChecked);

    setIsLoading(false);

  }

  return (
    <div>
      <form className="border" onSubmit={handleSubmit}>
        <div>
          <p>Two factor Authenticator</p>
          <p>6 digit authenticator code required when logging in</p>
          <Switch checked={faChecked} onCheckedChange={setFaChecked} />
        </div>
        <Button disabled={isLoading}>Submit</Button>
      </form>
    </div>
  )
}
