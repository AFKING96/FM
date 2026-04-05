import { GameLogic } from "@/components/GameLogic";
import ShaderBackground from "@/components/ShaderBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col selection:bg-brand-500 selection:text-white">
      <ShaderBackground />
      <GameLogic />
    </main>
  );
}
