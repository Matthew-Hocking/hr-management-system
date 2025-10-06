"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800">
              HR System
            </Link>
          </div>

          {/* Desktop links */}
          {session?.user.role === "ADMIN" && (
            <div className="hidden md:flex items-center ml-10 space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/employees"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Employees
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:flex items-center text-sm text-gray-600">
              {session?.user.email}
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {session?.user.role}
              </span>
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>

            {/* Mobile menu button */}
            {session?.user.role === "ADMIN" && (
              <button
                className="md:hidden ml-2 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? "X" : "="}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && session?.user.role === "ADMIN" && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t">
          <Link
            href="/admin/dashboard"
            className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/employees"
            className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Employees
          </Link>
        </div>
      )}
    </nav>
  )
}