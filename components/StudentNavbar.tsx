"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function StudentNavbar() {
  const router = useRouter();

const logout = () => {
  localStorage.removeItem("role");
  router.push("/");
};

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <Link href="/student" className="text-lg font-semibold text-slate-900">
        CampusPrint
      </Link>

      <button
  onClick={logout}
  className="text-sm text-slate-600 hover:text-slate-900 transition"
>
  Switch Role
</button>

    </div>
  );
}
