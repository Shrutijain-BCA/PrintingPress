import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import StationeryRequest from "@/models/StationeryRequest";
import "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { studentId, item, quantity, notes } = body;

    if (!studentId || !item || !quantity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const request = await StationeryRequest.create({
      studentId,
      item,
      quantity,
      notes,
    });

    return NextResponse.json(
      { message: "Stationery request created", data: request },
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

export async function GET() {
  try {
    await dbConnect();

    const requests = await StationeryRequest.find()
      .populate("studentId", "identifier")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { data: requests },
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

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "id and status required" },
        { status: 400 }
      );
    }

    const updated = await StationeryRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

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
