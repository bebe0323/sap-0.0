import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { UserClient } from "../types/user";
import { signout } from "../actions/auth";

export default async function Page() {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("auth")?.value;
  if (!authCookie) {
    redirect("/login");
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
  console.log(user);
  return (
    <div>
    </div>
  )
}