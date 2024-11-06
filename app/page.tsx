import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { JwtPayloadType } from "./types/user";

const SECRET = new TextEncoder().encode(process.env.JSON_KEY!);

export default async function Home() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth")?.value;
  if (!authCookie) {
    return (
      <div>
        <p>Unauthenticated user</p>
      </div>
    )
  }

  const { payload } = await jwtVerify(authCookie, SECRET) as { payload: JwtPayloadType};

  if (!payload.totpEnabled) {
    return (
      <div>
        <p>Authenticated user</p>
        <p>TOTP not enabled</p>
      </div>
    )
  } else {
    if (!payload.totpDone) {
      return (
        <div>
          <p>Authenticated user</p>
          <p>TOTP enabled</p>
          <p>2fa pending</p>
        </div>
      )
    } else {
      return (
        <div>
          <p>Authenticated user</p>
          <p>TOTP enabled</p>
          <p>2fa completed</p>
        </div>
      )
    }
  }
}
