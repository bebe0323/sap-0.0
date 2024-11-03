"use client";

import { LogOut } from "lucide-react";
import { signout } from "../../app/actions/auth";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignoutButton() {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  
  const handleSignout = async () => {
    setLoading(true);
    await signout();
    setLoading(false);
    router.refresh();
  }

  return (
    <button disabled={isLoading} onClick={handleSignout} className="navbar-element w-full">
      <LogOut className="navbar-icon" />
      <p>Sign out</p>
    </button>
  )
}
