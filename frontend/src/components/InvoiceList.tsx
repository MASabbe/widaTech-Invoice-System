import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, User, MoreVertical, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";

export function InvoiceList() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page],
    queryFn: async () => {
      const res = await fetch(`/api/invoices?page=${page}`);
      return res.json();
    }
  });

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200" />)}
  </div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.data.map((inv: any) => (
          <div key={inv.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-50">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-50 p-3 rounded-xl">
                <Receipt className="text-slate-400 group-hover:text-indigo-500 transition-colors" size={24} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-800">${Number(inv.totalAmount).toLocaleString()}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Paid</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">Customer</p>
                  <p className="font-bold text-slate-700">{inv.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Salesperson</p>
                  <p className="font-semibold text-slate-600">{inv.salespersonName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl">
                <Calendar size={16} />
                <span>{format(new Date(inv.date), "PPP")}</span>
                <span className="ml-auto flex items-center gap-1 text-slate-400">
                  <CreditCard size={14} />
                  Cash/Transfer
                </span>
              </div>

              {inv.notes && (
                <div className="text-xs text-slate-400 italic">
                  Note: {inv.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 pt-8">
        <button 
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          {Array.from({ length: data?.pages || 0 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm ${
                page === i + 1 ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-white text-slate-400 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          disabled={page >= (data?.pages || 1)}
          onClick={() => setPage(p => p + 1)}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Receipt({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
