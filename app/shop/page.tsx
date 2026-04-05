"use client";
import { useEffect, useState } from "react";

import ShopNavbar from "@/components/ShopNavbar";
import StatusBadge from "@/components/StatusBadge";

type Status = "pending" | "preparing" | "ready";

export default function ShopDashboard() {
  const [stationeryRequests, setStationeryRequests] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/print");

        if (!res.ok) {
          console.error("Failed to fetch print requests");
          setRequests([]);
          return;
        }

        const data = await res.json();
        setRequests(data.data || []);
      } catch (err) {
        console.error(err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchStationeryRequests = async () => {
      try {
        const res = await fetch("/api/stationery");

        if (!res.ok) {
          setStationeryRequests([]);
          return;
        }

        const data = await res.json();
        setStationeryRequests(data.data || []);
      } catch (err) {
        console.error(err);
        setStationeryRequests([]);
      }
    };


    fetchRequests();
    fetchStationeryRequests();

  }, []);

  const updateStatus = async (id: string, status: "pending" | "preparing" | "ready") => {
    try {
      await fetch("/api/print", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      // refresh list
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateStationeryStatus = async (
    id: string,
    status: "pending" | "preparing" | "ready"
  ) => {
    try {
      await fetch("/api/stationery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      setStationeryRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error(err);
    }
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

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
            <p className="text-slate-500">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
            <p className="text-slate-600">No print requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    Print • Student {req.studentId?.identifier}
                  </p>
                  <p className="text-sm text-slate-500">
                    Pages {req.fromPage} – {req.toPage}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={req.status} />

                  {req.status === "pending" && (
                    <button
                      onClick={() => updateStatus(req._id, "preparing")}
                      className="text-sm px-3 py-1 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                    >
                      Prepare
                    </button>
                  )}

                  {req.status === "preparing" && (
                    <button
                      onClick={() => updateStatus(req._id, "ready")}
                      className="text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition"
                    >
                      Mark Ready
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
