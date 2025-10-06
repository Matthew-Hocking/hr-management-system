import { auth } from "@/auth"
import { db } from "@/app/lib/db"
import { NextResponse } from "next/server"

// GET single employee
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employee = await db.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error fetching employee:", error)
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    )
  }
}

// PUT update employee
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, position, department, salary } = body

    const employee = await db.employee.update({
      where: { id },
      data: {
        name,
        position,
        department,
        salary: parseFloat(salary),
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    )
  }
}

// DELETE employee (soft-delete)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employee = await db.employee.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Delete employee
    await db.employee.delete({ where: { id } })

    // Mark associated user as inactive
    await db.user.update({
      where: { id: employee.userId },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Employee deleted successfully" })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    )
  }
}