"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

useEffect(() => {
  const role = localStorage.getItem("role");
  if (role === "student") router.push("/student");
  if (role === "shop") router.push("/shop");
}, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          CampusPrint
        </h1>
        <p className="text-slate-500 mt-2">
          Queue-free college printing system
        </p>

        <div className="mt-8 space-y-4">
          <button
  onClick={() => {
    localStorage.setItem("role", "student");
    router.push("/student");
  }}
  className="block w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition"
>
  Continue as Student
</button>


          <button
  onClick={() => {
    localStorage.setItem("role", "shop");
    router.push("/shop");
  }}
  className="block w-full bg-slate-100 text-slate-900 py-2.5 rounded-md hover:bg-slate-200 transition"
>
  Continue as Print Shop
</button>

        </div>
      </div>
    </div>
  );
}
