import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Sparkles, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const translations = translationsData as Record<string, any>;

export default function GenericAiTool({ title = "AI Writer", desc = "Professional AI writing assistant." }) {
  const { language } = useLanguageStore();
  const [inputType, setInputType] = useState<"text" | "file">("text");

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free AI Writing Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-32 px-4">
          <div className="w-full h-[90px] bg-slate-50 mb-10 border-b flex items-center justify-center overflow-hidden">
            <div className="w-[728px] h-[60px] bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest font-bold rounded">
              Leaderboard Ad (728x90)
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <div className="mb-12 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <div className="p-2 bg-slate-900 rounded-lg text-white">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                    {title}
                  </h1>
                </div>
                <p className="text-xl text-slate-600 font-medium opacity-80">{desc}</p>
              </div>

              <div className="mb-8 flex justify-center lg:justify-start gap-4">
                <Button 
                  variant={inputType === "text" ? "default" : "outline"} 
                  onClick={() => setInputType("text")}
                  className="rounded-full font-bold"
                >
                  Write Text
                </Button>
                <Button 
                  variant={inputType === "file" ? "default" : "outline"} 
                  onClick={() => setInputType("file")}
                  className="rounded-full font-bold"
                >
                  Upload Document
                </Button>
              </div>

              {inputType === "file" ? (
                <ToolWorkflow 
                  toolName={title} 
                  acceptedFileTypes=".txt,.doc,.docx,.pdf" 
                />
              ) : (
                <div className="space-y-6">
                  <textarea 
                    className="w-full h-64 p-6 rounded-3xl border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-lg font-medium resize-none placeholder:text-slate-300"
                    placeholder="Enter your topic or starting text here..."
                  />
                  <div className="flex justify-center">
                    <Button size="lg" className="rounded-full px-16 font-bold h-16 shadow-2xl bg-slate-900 text-white text-lg">
                      <PenTool className="w-5 h-5 mr-3" />
                      Generate with AI
                    </Button>
                  </div>
                  <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                    Takes approx. 10 seconds to generate high-quality output
                  </p>
                </div>
              )}

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-20 text-slate-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">AI-Powered Content Generation</h2>
                    <p className="text-md font-medium leading-relaxed">Our advanced AI models analyze your requirements to produce professional, human-like content in seconds. Perfect for blogs, emails, and social media.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Secure & Private</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"Your input data is processed securely and never used for training or stored longer than 60 minutes."</p>
                  </section>
                </div>
              </article>
            </div>

            <aside className="lg:col-span-3">
              <div className="sticky top-24 h-[600px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter p-2 text-center">
                Skyscraper Ad<br/>(160x600)
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
