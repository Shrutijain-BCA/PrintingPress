import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    await dbConnect();

    const user = await User.create({
      role: "student",
      identifier: "STUDENT_001",
    });

    return NextResponse.json(
      { message: "User created", data: user },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
