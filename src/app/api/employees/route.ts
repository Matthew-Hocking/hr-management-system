import { auth } from "@/auth"
import { db } from "@/app/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// GET all employees
export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employees = await db.employee.findMany({
      orderBy: {
        createdAt: 'desc',
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

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    )
  }
}

// POST create (or rehire) employee
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, position, department, salary } = body

    // Validate required fields
    if (!name || !email || !position || !department || !salary) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if the user already exists
    const existingUser = await db.user.findUnique({ where: { email } })

    // Generate a temporary password
    const tempPassword =
      Math.random().toString(36).slice(-10) +
      Math.random().toString(36).slice(-10)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    let employee

    if (!existingUser) {
      employee = await db.employee.create({
        data: {
          name,
          email,
          position,
          department,
          salary: parseFloat(salary),
          user: {
            create: {
              email,
              password: hashedPassword,
              role: "EMPLOYEE",
              isActive: true,
            },
          },
        },
        include: {
          user: { select: { email: true, role: true, isActive: true } },
        },
      })
    } else if (!existingUser.isActive) {
      employee = await db.employee.create({
        data: {
          name,
          email,
          position,
          department,
          salary: parseFloat(salary),
          user: {
            connect: { id: existingUser.id },
          },
        },
        include: {
          user: { select: { email: true, role: true, isActive: true } },
        },
      })

      await db.user.update({
        where: { id: existingUser.id },
        data: {
          isActive: true,
          role: "EMPLOYEE",
          password: hashedPassword,
        },
      })
    } else {
      return NextResponse.json(
        { error: "A user with this email already exists and is active" },
        { status: 400 }
      )
    }

    return NextResponse.json({ employee, tempPassword })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    )
  }
}