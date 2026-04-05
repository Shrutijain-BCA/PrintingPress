import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PrintRequest from "@/models/PrintRequest";
import mongoose from "mongoose";
import "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const authUser = getAuthUser(req);

    if (!authUser || authUser.role !== "student") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      fileUrl,
      fromPage,
      toPage,
      copies,
      printType,
    } = body;

    if (!fileUrl || !fromPage || !toPage) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }


    const newRequest = await PrintRequest.create({
      studentId: authUser.userId,
      fileUrl,
      fromPage,
      toPage,
      copies,
      printType,
    });


    return NextResponse.json(
      { message: "Print request created", data: newRequest },
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


export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    let query = {};

    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return NextResponse.json(
          { message: "Invalid studentId" },
          { status: 400 }
        );
      }
      query = { studentId };
    }

    const requests = await PrintRequest.find(query)
      .populate("studentId", "identifier")
      .sort({ createdAt: -1 });


    return NextResponse.json({ data: requests }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "id and status are required" },
        { status: 400 }
      );
    }

    const updated = await PrintRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Print request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Status updated", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

