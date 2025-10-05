import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { db } from "@/app/lib/db"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const totalEmployees = await db.employee.count()
  
  const employeesByDepartment = await db.employee.groupBy({
    by: ['department'],
    _count: {
      department: true,
    },
  })

  const recentEmployees = await db.employee.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session.user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* New Employee CTA */}
          <div className="bg-white rounded-lg shadow p-6">
            <Link href="/admin/employees/new" className="block h-full">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 inline-block mb-2">
                    <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Add New Employee</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalEmployees}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{employeesByDepartment.length}</p>
            </div>
          </div>

        </div>

        {/* Employees by Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Employees by Department</h2>
            <div className="space-y-3">
              {employeesByDepartment.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between">
                  <span className="text-gray-700">{dept.department}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {dept._count.department}
                  </span>
                </div>
              ))}
              {employeesByDepartment.length === 0 && (
                <p className="text-gray-500 text-sm">No employees yet</p>
              )}
            </div>
          </div>

          {/* Recent Employees */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Employees</h2>
            <div className="space-y-3">
              {recentEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-gray-900 font-medium">{emp.name}</p>
                    <p className="text-gray-500 text-sm">{emp.position}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentEmployees.length === 0 && (
                <p className="text-gray-500 text-sm">No employees yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}