import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Student Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Request prints or stationery without waiting in line
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/student/request-print"
          className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow transition"
        >
          <h2 className="text-lg font-medium text-slate-900">
            📄 Request Print
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload PDF and choose print options
          </p>
        </Link>

        <Link
          href="/student/request-stationery"
          className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow transition"
        >
          <h2 className="text-lg font-medium text-slate-900">
            ✏️ Request Stationery
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
          {/* Request Item */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-900">Print Request</p>
              <p className="text-sm text-slate-500">notes.pdf • 10 pages</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-700">
              Preparing
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-900">Stationery</p>
              <p className="text-sm text-slate-500">Blue Pen • Qty 2</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
              Ready
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-900">Print Request</p>
              <p className="text-sm text-slate-500">assignment.pdf • 5 pages</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-600">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
