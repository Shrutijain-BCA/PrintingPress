"use client";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import StudentNavbar from "@/components/StudentNavbar";
import { useEffect, useState } from "react";

type PrintRequest = {
  _id: string;
  fileUrl: string;
  fromPage: number;
  toPage: number;
  status: Status;
};

type Status = "pending" | "preparing" | "ready";


export default function StudentDashboard() {
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const studentId = "698312ef6ced30d7d9a18351";

        const res = await fetch(`/api/print?studentId=${studentId}`);
        const data = await res.json();

        setRequests(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <StudentNavbar />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, Student 👋
        </h1>
        <p className="text-slate-500 mt-1">
          What would you like to request today?
        </p>

        <div className="mt-4 border-b border-slate-200" />
      </div>


      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/student/request-print"
          className="bg-white border border-slate-200 rounded-lg p-6
             hover:shadow-md hover:border-slate-300
             transition cursor-pointer"
        >
          <h2 className="text-lg font-medium text-slate-900">
            📄 Request Print
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload PDF and choose print options
          </p>
        </Link>

        <Link
          href="/student/request-stationary"
          className="bg-white border border-slate-200 rounded-lg p-6
             hover:shadow-md hover:border-slate-300
             transition cursor-pointer"
        >
          <h2 className="text-lg font-medium text-slate-900">
            ✏️ Request Stationary
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pens, notebooks, files and more
          </p>
        </Link>
      </div>

      {/* Recent Requests */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-500">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-600">
            You haven’t made any print requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-slate-900">Print Request</p>
                <p className="text-sm text-slate-500">
                  Pages {req.fromPage} – {req.toPage}
                </p>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      )}


    </div>
  );
}
