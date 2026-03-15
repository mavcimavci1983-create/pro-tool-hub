import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Zap, Shield, Globe, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <HelmetProvider>
      <Helmet><title>About Us - ProToolHub</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">About ProToolHub</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">We believe powerful tools should be free, fast, and accessible to everyone — no sign-up required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">ProToolHub was created with one goal: to give everyone access to professional-grade document and media tools without paywalls, subscriptions, or complicated software installations.</p>
            <p className="text-slate-600 leading-relaxed mb-4">Whether you need to merge PDF files, compress images, convert videos, or remove backgrounds, ProToolHub handles it all — directly in your browser, with complete privacy.</p>
            <p className="text-slate-600 leading-relaxed">We process over 100,000 files every month for users around the world, from students and freelancers to enterprise teams.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: "100+ Tools", desc: "PDF, Image, Video, AI Writing and more" },
              { icon: <Shield className="w-8 h-8 text-green-500" />, title: "100% Secure", desc: "Files deleted automatically after processing" },
              { icon: <Globe className="w-8 h-8 text-blue-500" />, title: "Always Free", desc: "No subscription, no hidden fees" },
              { icon: <Users className="w-8 h-8 text-purple-500" />, title: "No Sign-up", desc: "Use any tool instantly, no account needed" },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Built for Everyone</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">From a student needing to compress a PDF for email submission, to a designer removing backgrounds for a client project — ProToolHub is your go-to toolkit. Free, fast, and always available.</p>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
