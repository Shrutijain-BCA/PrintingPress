"use client";
import { useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";
import StatusBadge from "@/components/StatusBadge";


type Status = "pending" | "preparing" | "ready";

const shopRequests: {
    id: number;
    student: string;
    type: string;
    description: string;
    status: Status;
}[]


export default function ShopDashboard() {
    return (
        <div className="min-h-screen bg-slate-50">
            <StudentNavbar />

            <div className="p-6">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Print Shop Dashboard
                </h1>
                <p className="text-slate-500 mt-1">
                    Manage print and stationery requests
                </p>

                <div className="mt-6 space-y-3">
                    {shopRequests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium text-slate-900">
                                    {req.type} • {req.student}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {req.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <StatusBadge status={req.status} />

                                {req.status === "pending" && (
                                    <button className="text-sm px-3 py-1 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition">
                                        Prepare
                                    </button>
                                )}

                                {req.status === "preparing" && (
                                    <button className="text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition">
                                        Mark Ready
                                    </button>
                                )}
                            </div>
                        </div>

                    ))}
                </div>

            </div>
        </div>
    );
}
