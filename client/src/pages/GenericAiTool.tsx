import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Sparkles, PenTool, Loader2, Copy, Check, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LeaderboardAd, StickySkyscraper, BillboardAd } from "@/components/ads/AdUnit";

const translations = translationsData as Record<string, any>;

export default function GenericAiTool({ title = "AI Writer", desc = "Professional AI writing assistant." }) {
  const { language } = useLanguageStore();
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const INPUT_MAX = 4000;

  async function handleGenerate() {
    const trimmed = input.trim();
    if (trimmed.length < 3) {
      setError("Please enter a topic or some text first.");
      return;
    }
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: title, input: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Could not generate text. Please try again.");
        return;
      }
      setOutput(data.output || "");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free AI Writing Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-20">
          <LeaderboardAd />

          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
            <StickySkyscraper side="left" />

            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
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
                  data-testid="button-input-text"
                >
                  Write Text
                </Button>
                <Button 
                  variant={inputType === "file" ? "default" : "outline"} 
                  onClick={() => setInputType("file")}
                  className="rounded-full font-bold"
                  data-testid="button-input-file"
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
                    value={input}
                    maxLength={INPUT_MAX}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    data-testid="textarea-ai-input"
                  />
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
                    <span>{input.length} / {INPUT_MAX}</span>
                    {input.length > 0 && !loading && (
                      <button
                        onClick={() => { setInput(""); setOutput(""); setError(""); }}
                        className="hover:text-slate-600 transition-colors uppercase tracking-widest"
                        data-testid="button-clear-ai"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={loading || input.trim().length < 3}
                      className="rounded-full px-16 font-bold h-16 shadow-2xl bg-slate-900 text-white text-lg disabled:opacity-50"
                      data-testid="button-generate-ai"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <PenTool className="w-5 h-5 mr-3" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div
                      className="flex items-start gap-3 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-700"
                      data-testid="text-ai-error"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  {output && (
                    <div className="space-y-4" data-testid="container-ai-output">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Result</h2>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="rounded-full font-bold"
                            data-testid="button-copy-ai"
                          >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="rounded-full font-bold"
                            data-testid="button-download-ai"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            .txt
                          </Button>
                        </div>
                      </div>
                      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 whitespace-pre-wrap text-slate-700 text-base leading-relaxed font-medium">
                        {output}
                      </div>
                    </div>
                  )}

                  {!output && !error && (
                    <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                      Free to use — 10 generations per 10 minutes
                    </p>
                  )}
                </div>
              )}

              <BillboardAd />

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">AI-Powered Content Generation</h2>
                    <p className="text-md font-medium leading-relaxed">Our advanced AI models analyze your requirements to produce professional, human-like content in seconds. Perfect for blogs, emails, and social media.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">How your input is handled</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">Your text is sent to our language model provider over an encrypted connection to produce the result, then discarded. We do not save it to our database or use it to train models. See our <a href="/privacy-policy" className="underline hover:text-slate-700">Privacy Policy</a> for details.</p>
                  </section>
                </div>
              </article>
            </div>

            <StickySkyscraper side="right" />
          </div>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
