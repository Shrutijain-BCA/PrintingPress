export default function StudentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <a href="/student/request-print" className="card">
          Request Print
        </a>
        <a href="/student/request-stationery" className="card">
          Request Stationery !!!!
        </a>
      </div>
    </div>
  );
}
