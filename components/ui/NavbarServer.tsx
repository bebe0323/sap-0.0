import { cookies } from "next/headers"
import Link from "next/link";
import {
  Users,
  LayoutDashboard,
  Database,
  Frame,
  LogIn,
  UserPlus,
  Contact,
} from "lucide-react";

import SignoutButton from "./SignoutButton";
import { getJwtPayload } from "@/app/actions/auth";

export default async function NavbarServer() {
  let user = await getJwtPayload();

  // Unauthorized user OR not completed 2fa
  if (!user || !user.totpDone) {
    return (
      <div className="navbar-outer">
        {/* TOP */}
        <div className="flex flex-col">
          <div className="flex my-4">
            <Frame className="navbar-icon" />
            <p className="text-black font-semibold">SAP</p>
          </div>
        </div>
        {/* Bottom */}
        <div className="mb-4 flex flex-col">
          <Link href={"/sign-in"} className="navbar-element">
            <LogIn className="navbar-icon" />
            <p>Sign-in</p>
          </Link>
          <Link href={"/sign-up"} className="navbar-element">
            <UserPlus className="navbar-icon" />
            <p>Sign-up</p>
          </Link>
          <Link href={"/contact"} className="navbar-element">
            <Contact className="navbar-icon" />
            <p>Contact</p>
          </Link>
        </div>
      </div>
    )
  }  

  // Authorized user
  return (
    <div className="navbar-outer">
      {/* TOP */}
      <div className="flex flex-col">
        <div className="flex my-4">
          <Frame className="navbar-icon" />
          <p className="text-black font-semibold">SAP</p>
        </div>
        <div className="mt-2">
          <p className="navbar-sub-text">GENERAL</p>
          <Link href={"/users"} className="navbar-element">
            <Users className="navbar-icon" />
            <p>Users</p>
          </Link>
          <Link href={"/2fa"} className="navbar-element">
            <LayoutDashboard className="navbar-icon"/>
            <p>Two Factor Auth</p>
          </Link>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="mb-4">
        <Link href={"/profile"} className="navbar-element">
          <Contact className="navbar-icon" />
          <p>Profile</p>
        </Link>
        <SignoutButton />
      </div>
    </div>
  )
}
