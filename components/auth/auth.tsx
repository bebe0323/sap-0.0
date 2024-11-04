import { signout } from "@/app/actions/auth";
import { TypeUserClient } from "@/app/types/user";

export function Profile({user}: {user: TypeUserClient}) {
  return (
    <form action={signout}>
      <div>
        <p>{user.email}</p>
      </div>
      <button type="submit">Sign out</button>
    </form>
  )
}
