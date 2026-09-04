import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Sparkles, PenTool, Loader2, Copy, Check, Download, AlertCircle, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ToolSeoContent, hasToolSeo } from "@/components/tool/ToolSeoContent";

const translations = translationsData as Record<string, any>;

export default function GenericAiTool({ title = "AI Writer", desc = "Professional AI writing assistant." }) {
  const { language } = useLanguageStore();
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [docNote, setDocNote] = useState("");

  const INPUT_MAX = 4000;

  /**
   * Belgeyi metne cevirir ve AI kutusuna yazar.
   *
   * Onceki hali dosyayi ToolWorkflow'a veriyordu; orada hicbir arac tipiyle
   * eslesmedigi icin "identity"ye dusuyor ve kullaniciya kendi dosyasi geri
   * indiriliyordu. Artik metin sunucuda cikariliyor (/api/extract-text) ve
   * yazma kutusuna konuyor - kullanici gonderilecek metni gorup duzenleyebilir.
   */
  async function handleDocument(file: File) {
    setExtracting(true);
    setError("");
    setDocNote("");
    setOutput("");
    try {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const res = await fetch("/api/extract-text", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "This document could not be read.");
        return;
      }
      setInput(data.text || "");
      setDocNote(
        data.truncated
          ? `Loaded the first ${data.characters.toLocaleString()} characters of ${file.name}. The rest was left out because the tool accepts up to ${INPUT_MAX.toLocaleString()} characters.`
          : `Loaded ${data.characters.toLocaleString()} characters from ${file.name}. Edit the text below if you want, then generate.`,
      );
      setInputType("text");
    } catch {
      setError("Network error while reading the document. Please try again.");
    } finally {
      setExtracting(false);
    }
  }

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
          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
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
                <div className="w-full max-w-4xl mx-auto">
                  <label
                    className={`relative block cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all ${
                      extracting
                        ? "border-slate-200 bg-slate-50"
                        : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/50"
                    }`}
                    data-testid="dropzone-ai-document"
                  >
                    <input
                      type="file"
                      accept=".txt,.md,.pdf,.docx"
                      className="hidden"
                      disabled={extracting}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) handleDocument(f);
                      }}
                      data-testid="input-ai-document"
                    />
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                        {extracting ? (
                          <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        ) : (
                          <Upload className="w-12 h-12 text-primary" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                        {extracting ? "Reading your document…" : "Drop a document here"}
                      </h3>
                      <p className="text-slate-500 font-medium mb-2">
                        We read the text out of it and put it in the writing box, so you can
                        check and edit it before generating.
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        .txt · .md · .pdf · .docx — up to 10 MB
                      </p>
                    </div>
                  </label>

                  {error && (
                    <div
                      className="mt-6 flex items-start gap-3 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-700"
                      data-testid="text-ai-doc-error"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  <p className="mt-6 text-center text-xs text-slate-400 font-medium leading-relaxed">
                    Scanned PDFs hold pictures of text rather than text itself, so nothing can be
                    read from them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {docNote && (
                    <div
                      className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600"
                      data-testid="text-ai-doc-note"
                    >
                      <FileText className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                      <p className="text-sm font-medium leading-relaxed">{docNote}</p>
                    </div>
                  )}
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

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <ToolSeoContent title={title} />

                {!hasToolSeo(title) && (
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">AI-Powered Content Generation</h2>
                    <p className="text-md font-medium leading-relaxed">Our advanced AI models analyze your requirements to produce professional, human-like content in seconds. Perfect for blogs, emails, and social media.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">How your input is handled</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">Your text — typed or read out of a document you upload — is sent to Anthropic over an encrypted connection to produce the result, then discarded. We do not save it to our database, and we do not use it to train anything. See our <a href="/privacy-policy" className="underline hover:text-slate-700">Privacy Policy</a> for details.</p>
                  </section>
                </div>
                )}
              </article>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
