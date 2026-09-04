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
            <p className="text-slate-600 leading-relaxed mb-4">Whether you need to merge PDF files, compress images, convert videos, or remove backgrounds, ProToolHub covers it. Where the work can be done on your own machine it is — image, video and file-conversion tools run inside the browser and never upload anything. The remaining PDF tools need our server, and our Privacy Policy explains exactly what happens to a file when they do.</p>
            <p className="text-slate-600 leading-relaxed">The toolkit currently covers 47 tools across PDF, image, video, file conversion, and AI-assisted writing. Image and video tools run entirely inside your browser, so those files never leave your device.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: "47 Tools", desc: "PDF, Image, Video, Conversion and AI Writing" },
              { icon: <Shield className="w-8 h-8 text-green-500" />, title: "Private by Design", desc: "Image and video tools process files in your browser" },
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
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">From a student compressing a PDF for an email submission to a designer removing backgrounds for a client project, these are everyday jobs that should not need an account or an installer. Free to use, with no sign-up.</p>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
