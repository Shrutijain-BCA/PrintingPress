"use client";
import { useState } from "react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import StudentNavbar from "@/components/StudentNavbar";

export default function RequestStationeryPage() {
    const [item, setItem] = useState("");
    const [quantity, setQuantity] = useState("");

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
            <StudentNavbar />
            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Request Stationery
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Request pens, notebooks, files, and more
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
                    {/* Item Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Item Name
                        </label>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            placeholder="Pen / Notebook / File"
                            className="w-full border border-slate-300 rounded-md p-2
           focus:outline-none focus:ring-2 focus:ring-blue-200
           focus:border-blue-500"

                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Quantity
                        </label>
                        <input
                            type="number"
                            placeholder="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border border-slate-300 rounded-md p-2
           focus:outline-none focus:ring-2 focus:ring-blue-200
           focus:border-blue-500"

                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Blue pen preferred"
                            className="w-full border border-slate-300 rounded-md p-2
           focus:outline-none focus:ring-2 focus:ring-blue-200
           focus:border-blue-500"

                        />
                    </div>

                    {/* Submit */}
                    <PrimaryButton disabled={!item || !quantity}>
                        Submit Stationery Request
                    </PrimaryButton>


                </div>
            </div>
        </div>
    );
}
