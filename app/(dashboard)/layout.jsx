import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar at top */}
      <Navbar />

      {/* Body below navbar */}
      <div className="flex flex-1 min-h-0">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 ">
          {children}
        </main>

      </div>
    </div>
  );
}
