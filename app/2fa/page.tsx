
import { redirect } from "next/navigation";
import { getJwtPayload } from "../actions/auth";
import TwoFactorForm from "@/components/2fa/twoFactorAuth";

// page for setting up 2fa
export default async function Page() {
  const user = await getJwtPayload();
  if (!user) redirect('/sign-in');
  return (
    <div>
      <TwoFactorForm user={user} />
    </div>
  )
}
