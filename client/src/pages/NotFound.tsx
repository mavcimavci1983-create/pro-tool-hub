import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-12 text-center shadow-2xl rounded-3xl border-none bg-white animate-in zoom-in duration-300">
          <div className="bg-rose-100 text-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-rose-50">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Page Not Found</h2>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">
            The tool or page you're looking for doesn't exist or has been moved to a new location.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full rounded-full font-bold h-14 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => window.history.back()} className="mt-4 text-slate-400 font-bold hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
