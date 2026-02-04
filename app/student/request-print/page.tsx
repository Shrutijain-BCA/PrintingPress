"use client";
import { useState } from "react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import StudentNavbar from "@/components/StudentNavbar";
import { useRouter } from "next/navigation";


export default function RequestPrintPage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [copies, setCopies] = useState("1");
  const [printType, setPrintType] = useState<"bw" | "color">("bw");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // TEMP studentId (same one you used earlier)
      const studentId = "698312ef6ced30d7d9a18351";

      const res = await fetch("/api/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          fileUrl: "https://example.com/dummy.pdf", // file upload later
          fromPage: Number(fromPage),
          toPage: Number(toPage),
          copies: Number(copies),
          printType,
        }),
      });

      if (!res.ok) {
        alert("Failed to submit print request");
        return;
      }

      // success → go back to dashboard
      router.push("/student");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
      <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <StudentNavbar />
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Request Print
          </h1>
          <p className="text-slate-500 mt-1">
            Upload your file and choose print options
          </p>
          <Link
            href="/student"
            className="inline-block mt-3 text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:bg-slate-100 file:text-slate-700
                         hover:file:bg-slate-200"
            />
          </div>

          {/* Pages */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Page
              </label>
              <input
                type="number"
                value={fromPage}
                placeholder="1"
                onChange={(e) => setFromPage(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2
           focus:outline-none focus:ring-2 focus:ring-blue-200
           focus:border-blue-500"

              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                To Page
              </label>
              <input
                type="number"
                value={toPage}
                placeholder="10"
                onChange={(e) => setToPage(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2
           focus:outline-none focus:ring-2 focus:ring-blue-200
           focus:border-blue-500"

              />
            </div>
          </div>

          {/* Copies */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Number of Copies
            </label>
            <input
              type="number"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              placeholder="1"
              className="w-full border border-slate-300 rounded-md p-2
           focus:outline-none focus:ring-2 focus:ring-blue-200
           focus:border-blue-500"

            />
          </div>

          {/* Print Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Print Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" name="printType" defaultChecked />
                Black & White
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" name="printType" />
                Color
              </label>
            </div>
          </div>

          {/* Submit */}
          <PrimaryButton disabled={loading || !file || !fromPage || !toPage}>
            {loading ? "Submitting..." : "Submit Print Request"}
          </PrimaryButton>


        </div>
      </div>
    </div>
    </form>
  );
}
