import { createContext, useContext, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TabsContext = createContext<{ value: string; onValueChange: (v: string) => void } | null>(null);

export function Tabs({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: ReactNode }) {
  return <TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider>;
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex", className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;
  return (
    <button
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "px-6 py-2 rounded-lg font-medium transition-all",
        active ? "bg-slate-100 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <div>{children}</div>;
}
