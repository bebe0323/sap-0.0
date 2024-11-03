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
  BrickWall,
  BadgePlus
} from "lucide-react";
import jwt from "jsonwebtoken";

import SignoutButton from "./SignoutButton";
import { UserClient } from "@/app/types/user";
import { signout } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function NavbarServer() {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("auth")?.value;

  // Unauthorized user
  if (!authCookie) {
    return (
      <div className="navbar-outer">
        {/* TOP */}
        <div className="flex flex-col">
          <div className="flex my-4">
            <Frame className="navbar-icon" />
            <p className="text-black font-semibold">ISCM</p>
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


  let user: UserClient | null = null;
  try {
    const decoded = jwt.verify(authCookie, process.env.JSON_KEY!) as UserClient;
    user = decoded;
  } catch (err) {
    console.error("JWT verification failed:", err);
    await signout();
    redirect("/login");
  }

  // Authorized user
  return (
    <div className="navbar-outer">
      {/* TOP */}
      <div className="flex flex-col">
        <div className="flex my-4">
          <Frame className="navbar-icon" />
          <p className="text-black font-semibold">ISCM</p>
        </div>
        <div className="mt-2">
          <p className="navbar-sub-text">GENERAL</p>
          <Link href={"/users"} className="navbar-element">
            <Users className="navbar-icon" />
            <p>Users</p>
          </Link>
          <Link href={"/todo"} className="navbar-element">
            <LayoutDashboard className="navbar-icon"/>
            <p className="">Dashboard</p>
          </Link>
          <Link href={"/worksites"} className="navbar-element">
            <BrickWall className="navbar-icon"/>
            <p>Worksites</p>
          </Link>
        </div>

        {/* only visible to admins */}
        {user.role > 0 && (
          <div className="mt-2">
            <p className="navbar-sub-text">ADMIN</p>
            <Link href={"/pre-start-talk"} className="navbar-element">
              <Users className="navbar-icon" />
              <p>pre-start talk</p>
            </Link>
            <Link href={"/todo"} className="navbar-element">
              <LayoutDashboard className="navbar-icon"/>
              <p className="">Option 1</p>
            </Link>
            <Link href={"/todo"} className="navbar-element">
              <Database className="navbar-icon"/>
              <p>Option 2</p>
            </Link>
            <Link href={"/worksites/create"} className="navbar-element">
              <BadgePlus className="navbar-icon" />
              <p>create worksite</p>
            </Link>
          </div>
        )}
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
