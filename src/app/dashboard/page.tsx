import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Role-based redirects
  switch (session.user.role) {
    case "ADMIN":
      redirect("/admin/dashboard")
    case "EMPLOYEE":
      redirect("/employee/dashboard")
    default:
      redirect("/login")
  }
}