import Image from "next/image";
import StudentNavbar from "@/components/StudentNavbar";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">CampusPrint</h1>
      <p className="text-gray-600">
        No more waiting in print queues
      </p>

      <div className="flex gap-4">
        <a href="/login" className="btn-primary">Student Login</a>
        <a href="/login" className="btn-outline">Print Shop Login</a>
      </div>
    </main>
  );
}
