import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  VideoConverterTool,
  VideoToMp3Tool,
  VideoToGifTool,
  CompressVideoTool,
  MuteVideoTool,
  TrimVideoTool,
  RotateVideoTool,
  VideoResizerTool,
} from "@/components/home/VideoTools";
import { ToolSeoContent, hasToolSeo } from "@/components/tool/ToolSeoContent";
import { ToolGuides } from "@/components/tool/ToolGuides";

const translations = translationsData as Record<string, any>;

function getInlineTool(title: string) {
  const t = title.toLowerCase();
  // "resiz" once kontrol edilir: Video Resizer daha once asagidaki "convert"
  // dalina dusup format donusturucuyu ciziyordu.
  if (t.includes("resiz"))                                return <VideoResizerTool />;
  if (t.includes("compress"))                             return <CompressVideoTool />;
  if (t.includes("mute"))                                 return <MuteVideoTool />;
  if (t.includes("trim"))                                 return <TrimVideoTool />;
  if (t.includes("rotate"))                               return <RotateVideoTool />;
  if (t.includes("to gif") || t.includes("gif"))          return <VideoToGifTool />;
  if (t.includes("to mp3") || t.includes("mp3"))          return <VideoToMp3Tool />;
  if (t.includes("mp4 to webm") || t.includes("convert")) return <VideoConverterTool />;
  return null;
}

export default function VideoTool({ title = "Video Tool", desc = "Free online video converter - No Watermark" }) {
  const { language } = useLanguageStore();
  const inlineTool = getInlineTool(title);
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free Online Video Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-20">
          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight leading-none">{title}</h1>
                <p className="text-xl text-slate-600 font-medium opacity-80">{desc}</p>
              </div>
              {inlineTool ? (
                inlineTool
              ) : (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center">
                    <p className="text-slate-400 font-medium">{language === "en" ? "This tool is coming soon." : "Bu arac yakinda eklenecektir."}</p>
                  </div>
                </div>
              )}
              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <ToolSeoContent title={title} />

                {!hasToolSeo(title) && (
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Video Processing</h2>
                    <p className="text-md font-medium leading-relaxed">All video processing runs in your browser using FFmpeg compiled to WebAssembly, so your video is never uploaded to our server. No watermarks are added to the output.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">100% Client-Side</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">Your videos never leave your device. FFmpeg runs locally in your browser, so there is no upload and no server involved in the conversion itself.</p>
                  </section>
                </div>
                )}
                <ToolGuides />
              </article>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}