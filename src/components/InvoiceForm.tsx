import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, User, UserCheck, Calendar as CalendarIcon, Plus, X, Receipt, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useDebounce } from "../lib/hooks";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function InvoiceForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customerName: "",
    salespersonName: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search Products
  const { data: products = [], isFetching } = useQuery({
    queryKey: ["products", debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm.length < 2) return [];
      const res = await fetch(`/api/products/search?q=${debouncedSearchTerm}`);
      return res.json();
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  useEffect(() => {
    setSelectedIndex(-1);
  }, [products]);

  const addItem = (product: any) => {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      setItems(items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { productId: product.id, name: product.name, price: product.price, quantity: 1, picture: product.picture }]);
    }
    setSearchTerm("");
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (products.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      addItem(products[selectedIndex]);
    } else if (e.key === "Escape") {
      setSearchTerm("");
    }
  };

  const mutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      if (!res.ok) throw new Error("Submission failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    },
  });

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.productId !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.customerName || !formData.salespersonName || !formData.date || items.length === 0) {
      setError("Please fill in all mandatory fields and add at least one product.");
      return;
    }

    mutation.mutate({ ...formData, items });
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Form Fields */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="text-indigo-600" size={20} />
            Customer & Sales Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Customer Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Salesperson Name *</label>
              <div className="relative">
                <UserCheck size={18} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.salespersonName}
                  onChange={(e) => setFormData({ ...formData, salespersonName: e.target.value })}
                  placeholder="Enter salesperson name"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Transaction Date *</label>
              <div className="relative">
                <CalendarIcon size={18} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-1">
               <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
               <input 
                  type="text" 
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Internal notes..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
               />
            </div>
          </div>
        </section>

        {/* Product Selection */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={20} />
            Products Sold
          </h3>
          
          <div className="relative">
            <div className="relative">
              <div className="absolute left-4 top-3.5 flex items-center pointer-events-none">
                {isFetching ? (
                  <Loader2 size={20} className="text-indigo-500 animate-spin" />
                ) : (
                  <Search size={20} className="text-slate-400" />
                )}
              </div>
              <input 
                type="text" 
                placeholder="Search products (MacBook, iPhone...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <AnimatePresence>
              {(products.length > 0 || (searchTerm.length >= 2 && !isFetching && products.length === 0)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                  ref={dropdownRef}
                >
                  {products.length > 0 ? (
                    products.map((p: any, index: number) => (
                      <button
                        key={p.id}
                        onClick={() => addItem(p)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0",
                          selectedIndex === index && "bg-indigo-50"
                        )}
                      >
                        <img src={p.picture} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{p.name}</p>
                          <p className="text-sm text-slate-500">Stock: {p.stock} units</p>
                        </div>
                        <p className="font-black text-indigo-600 shrink-0">${Number(p.price).toLocaleString()}</p>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No products found matching "{searchTerm}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                <img src={item.picture} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity} x ${Number(item.price).toLocaleString()}</p>
                </div>
                <div className="font-bold">${(item.quantity * item.price).toLocaleString()}</div>
                <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-500 transition-all p-1">
                  <X size={18} />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <Receipt className="mx-auto text-slate-200 w-12 h-12 mb-2" />
                <p className="text-slate-400">No products added yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Summary Sidebar */}
      <div className="space-y-6">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-10">
          <h3 className="text-xl font-bold mb-6">Payment Summary</h3>
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-slate-900 border-t border-slate-100 pt-4">
              <span>Total</span>
              <span className="text-indigo-600">${total.toLocaleString()}</span>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-3 text-sm font-medium my-4 border border-red-100"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}
            
            {showSuccess && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-green-50 text-green-600 p-4 rounded-xl flex gap-3 text-sm font-medium my-4 border border-green-100"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                Invoice saved successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className={cn(
              "w-full mt-6 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
              mutation.isPending ? "bg-slate-200 text-slate-400" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-black"
            )}
          >
            {mutation.isPending ? "Processing..." : "Complete Transaction"}
          </button>
        </section>
      </div>
    </div>
  );
}
