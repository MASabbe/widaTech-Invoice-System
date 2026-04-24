import { ReactNode } from "react";
import { ReceiptText, LayoutDashboard, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ReceiptText className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">WidaPOS</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            Invoices
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-medium transition-colors">
            <Settings size={20} />
            Settings
          </a>
        </nav>
        
        <div className="p-6 border-t border-slate-100 flex items-center gap-3 mt-auto">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm">John Doe</p>
            <p className="text-xs text-slate-400 truncate">Senior Engineer</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
