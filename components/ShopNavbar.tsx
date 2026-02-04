import Link from "next/link";

export default function ShopNavbar() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <Link href="/shop" className="text-lg font-semibold text-slate-900">
        CampusPrint
      </Link>

      <span className="text-sm text-slate-500">
        Print Shop
      </span>
    </div>
  );
}
