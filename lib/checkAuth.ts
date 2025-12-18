"use server";

import { redirect } from "next/navigation";
import getSession from "./getSession";
import { signOut } from "./auth";

export default async function checkAuth(
  roles: ("admin" | "user" | "moderator")[] = []
) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  if (roles && roles.length > 0 && !roles.includes(session.user.role)) {
    await signOut();
  }

  return session;
}
