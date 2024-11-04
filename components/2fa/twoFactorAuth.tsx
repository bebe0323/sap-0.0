"use client";

import { JwtPayloadType } from "@/app/types/user";
import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch"
import { totpUpdate } from "@/app/actions/totp";

export default function TwoFactorForm({user}: {user: JwtPayloadType}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [faChecked, setFaChecked] = useState<boolean>(user.totpEnabled);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // const formData = new FormData(event.currentTarget);
    const res = await totpUpdate(faChecked);
    // todo: update cookie
    if (!res.success) {
      setError(res.message);
    } else {
      setTotpSecret(res.totpSecretKey);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <form className="border" onSubmit={handleSubmit}>
        <div>
          <p>Two factor Authenticator</p>
          <p>6 digit authenticator code required when logging in</p>
          <Switch checked={faChecked} onCheckedChange={setFaChecked} />
          {totpSecret &&
            <div>
              <p>Secret key for TOTP (don&apos;t share with anyone)</p>
              {totpSecret}
            </div>
          }
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        </div>
        <Button disabled={isLoading}>
        {isLoading && <p>Submitting</p>}
        {!isLoading && <p>Submit</p>}
        </Button>
      </form>
    </div>
  )
}
