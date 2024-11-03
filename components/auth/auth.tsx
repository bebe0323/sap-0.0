import { signout } from "@/app/actions/auth";
import { UserClient } from "@/app/types/user";

export function Profile({user}: {user: UserClient}) {
  return (
    <form action={signout}>
      <div>
        <p>{user.email}</p>
      </div>
      <button type="submit">Sign out</button>
    </form>
  )
}
