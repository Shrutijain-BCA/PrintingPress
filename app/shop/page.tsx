"use client";

import { useState } from "react";
import ShopNavbar from "@/components/ShopNavbar";
import StatusBadge from "@/components/StatusBadge";

type Status = "pending" | "preparing" | "ready";

type Request = {
  id: number;
  student: string;
  type: string;
  description: string;
  status: Status;
};

const INITIAL_REQUESTS: Request[] = [
  {
    id: 1,
    student: "A123",
    type: "Print",
    description: "notes.pdf • 10 pages",
    status: "pending",
  },
  {
    id: 2,
    student: "B456",
    type: "Stationery",
    description: "Blue Pen • Qty 2",
    status: "preparing",
  },
  {
    id: 3,
    student: "C789",
    type: "Print",
    description: "assignment.pdf • 5 pages",
    status: "ready",
  },
];

export default function ShopDashboard() {
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);

  const updateStatus = (id: number, status: Status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ShopNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Print Shop Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Manage print and stationery requests
        </p>

        <div className="mt-6 space-y-3">
          {requests.map((req) => (
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
                  <button
                    onClick={() => updateStatus(req.id, "preparing")}
                    className="text-sm px-3 py-1 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200"
                  >
                    Prepare
                  </button>
                )}

                {req.status === "preparing" && (
                  <button
                    onClick={() => updateStatus(req.id, "ready")}
                    className="text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                  >
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
