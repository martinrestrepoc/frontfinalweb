"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-10 text-purple-300 drop-shadow-md">
        🕹️ The Arena of Power
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Dictators */}
        <Card className="bg-zinc-900 border-zinc-700 shadow-md hover:shadow-purple-500/30 transition-all">
          <CardContent className="p-6 flex flex-col items-start space-y-4">
            <h2 className="text-xl font-semibold text-purple-400">Dictators</h2>
            <p className="text-sm text-zinc-400">
              Rule the regions, manage your tyrants and contestants, shape your empire.
            </p>
            <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-500">
              <Link href="/dictators">Go to Dictators</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Battles */}
        <Card className="bg-zinc-900 border-zinc-700 shadow-md hover:shadow-red-500/30 transition-all">
          <CardContent className="p-6 flex flex-col items-start space-y-4">
            <h2 className="text-xl font-semibold text-red-400">Battles</h2>
            <p className="text-sm text-zinc-400">
              Track brutal battles between slaves, victories, and bloodshed for Carolina.
            </p>
            <Button asChild variant="default" className="bg-red-600 hover:bg-red-500">
              <Link href="/battles">Go to Battles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}