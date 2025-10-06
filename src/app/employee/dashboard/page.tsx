import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { db } from "@/app/lib/db"

export default async function EmployeeDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "EMPLOYEE") {
    redirect("/login")
  }

  // Fetch employee data
  const employee = await db.employee.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
  })

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">Employee profile not found</p>
            <p className="text-red-600 text-sm mt-2">Please contact your administrator</p>
          </div>
        </div>
      </div>
    )
  }

  const memberSince = new Date(employee.user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {employee.name}!</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <p className="text-lg text-gray-900 font-medium">{employee.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <p className="text-lg text-gray-900 font-medium">{employee.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Position
                </label>
                <p className="text-lg text-gray-900 font-medium">{employee.position}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department
                </label>
                <span className="text-lg text-gray-900 font-medium">
                  {employee.department}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Annual Salary
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  £{employee.salary.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Member Since
                </label>
                <p className="text-lg text-gray-900 font-medium">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}