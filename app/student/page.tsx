import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import StudentNavbar from "@/components/StudentNavbar";


type Status = "pending" | "preparing" | "ready";

const dummyRequests: {
  id: number;
  type: string;
  description: string;
  status: Status;
}[] = [
  {
    id: 1,
    type: "Print Request",
    description: "notes.pdf • 10 pages",
    status: "preparing",
  },
  {
    id: 2,
    type: "Stationery",
    description: "Blue Pen • Qty 2",
    status: "ready",
  },
  {
    id: 3,
    type: "Print Request",
    description: "assignment.pdf • 5 pages",
    status: "pending",
  },
];

export default function StudentDashboard() {
  const hasRequests = true;
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
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          My Recent Requests
        </h2>

        <div className="space-y-3">
          {hasRequests ? (
            <div className="space-y-3">
              {dummyRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-900">{req.type}</p>
                    <p className="text-sm text-slate-500">{req.description}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>

          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
              <p className="text-slate-600">
                You haven’t made any requests yet.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Start by requesting a print or stationery item.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
