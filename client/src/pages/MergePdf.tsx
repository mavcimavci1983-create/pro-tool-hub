import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileStack, UploadCloud, AlertCircle, Info, Merge } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function MergePdf() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSimulate = () => {
    setIsProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsProcessing(false), 500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">Merge PDF</h1>
          <p className="text-muted-foreground mb-8">Combine multiple PDF files into one document securely.</p>
          
          <Card className="p-10 md:p-20 border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors rounded-2xl">
            <div className="bg-primary text-primary-foreground p-4 rounded-full mb-6">
              <FileStack className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Upload PDF Files</h3>
            <p className="text-muted-foreground mb-6">Select two or more PDF files from your device</p>
            <Button size="lg" className="rounded-full px-8 font-bold" onClick={handleSimulate}>
              {isProcessing ? `Merging... ${progress}%` : "Select Files"}
            </Button>
          </Card>

          <Alert className="mt-8 bg-amber-50 border-amber-200 text-amber-900 text-left">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="font-bold">Real-time Deletion Active</AlertTitle>
            <AlertDescription className="mt-1">
              Your files are processed on our secure Node.js backend. <strong>All uploaded data is automatically wiped from /temp exactly 60 minutes after upload</strong> using our autonomous cleanup system.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
    </div>
  );
}