import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Mail, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in all fields."); setStatus("error"); return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("success");
      setName(""); setEmail(""); setMessage("");
    } catch (e: any) {
      setErrorMsg(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <HelmetProvider>
      <Helmet><title>Contact Us - ProToolHub</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">Contact Us</h1>
          <p className="text-xl text-slate-600">Have a question, suggestion, or issue? We would love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Mail className="w-8 h-8 text-blue-500" />, title: "General Inquiries", desc: "hello@protoolhub.net" },
            { icon: <MessageSquare className="w-8 h-8 text-green-500" />, title: "Bug Reports", desc: "bugs@protoolhub.net" },
            { icon: <Clock className="w-8 h-8 text-orange-500" />, title: "Response Time", desc: "Within 24-48 hours" },
          ].map((item, i) => (
            <div key={i} className="text-center bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-3xl p-12 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Send Us a Message</h2>
          {status === "success" ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-600 mb-6">Thank you for reaching out. We will get back to you within 24-48 hours.</p>
              <button onClick={() => setStatus("idle")} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors">Send Another Message</button>
            </div>
          ) : (
            <div className="space-y-6 max-w-lg mx-auto">
              {status === "error" && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{errorMsg}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                <input type="text" value={name} onChange={e => { setName(e.target.value); setStatus("idle"); }} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setStatus("idle"); }} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea rows={5} value={message} onChange={e => { setMessage(e.target.value); setStatus("idle"); }} placeholder="Tell us how we can help..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={status === "loading"} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              <p className="text-xs text-slate-400 text-center">Or email us directly at <a href="mailto:hello@protoolhub.net" className="underline">hello@protoolhub.net</a></p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}

