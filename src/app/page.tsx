import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScriptGenerator } from "@/components/script-generator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ScriptGenerator />
      </main>
      <Footer />
    </div>
  );
}