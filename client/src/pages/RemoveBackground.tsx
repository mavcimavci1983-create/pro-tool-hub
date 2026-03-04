import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scissors, Sparkles, UploadCloud, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function RemoveBackground() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">AI Background Remover</h1>
          <p className="text-muted-foreground mb-8">Remove image backgrounds automatically in seconds with high precision AI.</p>
          
          <Card className="p-10 md:p-20 border-2 border-dashed border-orange-500/30 bg-orange-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50 transition-colors rounded-2xl">
            <div className="bg-orange-500 text-white p-4 rounded-full mb-6">
              <Scissors className="w-10 h-10" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold">Upload Image</h3>
              <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>
            <p className="text-muted-foreground mb-6">Drop your image here to remove the background</p>
            <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
              Choose Image
            </Button>
          </Card>

          <Alert className="mt-8 bg-blue-50 border-blue-200 text-blue-900 text-left">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="font-bold">60-Minute Auto-Wipe</AlertTitle>
            <AlertDescription className="mt-1">
              Backend processing is active. Your temporary files are scheduled for <strong>immediate and permanent fs.unlink exactly 1 hour after upload</strong>. No logs, no traces.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
    </div>
  );
}