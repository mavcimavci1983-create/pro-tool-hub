import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryCards } from "@/components/home/CategoryCards";
import { Stats } from "@/components/home/Stats";
import { ToolGrid } from "@/components/home/ToolGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-10 px-4 flex flex-col items-center text-center relative overflow-hidden">
          {/* Abstract floating shapes for decoration */}
          <div className="absolute top-10 left-20 w-8 h-8 bg-pink-500 rounded-sm rotate-12 opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-50 animate-bounce"></div>
          <div className="absolute bottom-10 left-1/4 w-4 h-4 bg-blue-500 rounded-sm rotate-45 opacity-50"></div>
          <div className="absolute top-20 right-1/4 w-3 h-3 bg-yellow-400 rounded-full opacity-80"></div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4 text-foreground max-w-3xl leading-tight">
            Free Tools to Make <span className="bg-rose-600 text-white px-4 py-1 rounded-lg inline-block transform -rotate-2">Your Life</span> Simple
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl">
            We offer PDF, video, image and other online tools to make your life easier
          </p>
          
          <div className="w-full max-w-2xl relative mb-8 flex items-center shadow-lg rounded-full">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search" 
              className="w-full h-14 pl-12 pr-24 rounded-full border-border bg-card text-lg focus-visible:ring-primary focus-visible:ring-offset-2"
            />
            <Button className="absolute right-2 rounded-full px-6 bg-primary hover:bg-primary/90 text-white h-10">
              Search
            </Button>
          </div>
          
          <CategoryCards />
        </section>

        <Stats />
        
        <ToolGrid />
      </main>

      <Footer />
    </div>
  );
}