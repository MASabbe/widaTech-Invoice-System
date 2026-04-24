import { useState } from "react";
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoiceList } from '../components/InvoiceList';
import { RevenueAnalytics } from '../components/RevenueAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import { motion, AnimatePresence } from "motion/react";
import { Plus, ListFilter, BarChart3 } from "lucide-react";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoice Management</h2>
          <p className="text-slate-500 mt-1">Manage your point-of-sale transactions and revenue performance.</p>
        </div>
        
        <button 
          onClick={() => setActiveTab("new")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white p-1 rounded-xl border border-slate-200 inline-flex shadow-sm">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ListFilter size={18} />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={18} />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Plus size={18} />
            New Invoice
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "list" && <InvoiceList />}
              {activeTab === "analytics" && <RevenueAnalytics />}
              {activeTab === "new" && <InvoiceForm onSuccess={() => setActiveTab("list")} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
