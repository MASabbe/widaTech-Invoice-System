import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

export function RevenueAnalytics() {
  const [period, setPeriod] = useState("daily");

  const { data: revenueData = [] } = useQuery({
    queryKey: ["revenue", period],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/revenue?period=${period}`);
      return res.json();
    }
  });

  const totalRevenue = revenueData.reduce((acc: number, curr: any) => acc + curr.value, 0);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div className="bg-emerald-50 p-3 rounded-xl">
               <TrendingUp className="text-emerald-500" size={24} />
             </div>
             <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
               <ArrowUpRight size={14} />
               +12.5%
             </span>
           </div>
           <div className="mt-4">
             <p className="text-slate-400 font-medium text-sm">Total Revenue ({period})</p>
             <h4 className="text-3xl font-black text-slate-800">${totalRevenue.toLocaleString()}</h4>
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} />
              Revenue Projection
            </h3>
            <p className="text-slate-400 text-sm">Visualizing transaction volume and earnings.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  period === p ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", padding: "16px" }}
                itemStyle={{ fontBold: "700", color: "#4f46e5" }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4f46e5" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
