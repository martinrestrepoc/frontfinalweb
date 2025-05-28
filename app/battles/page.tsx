"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

// Página principal de Batallas con dos opciones:
// 1. Iniciar una nueva batalla
// 2. Ver el historial de batallas anteriores
export default function BattlesPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Barra de navegación común */}
      <Navbar />

      {/* Título principal */}
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center drop-shadow">
        🩸 Battle Arena
      </h1>

      {/* Contenedor con dos tarjetas para las opciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Tarjeta para iniciar batalla */}
        <Card className="bg-zinc-900 border border-zinc-700 shadow-md hover:shadow-purple-500/30 transition-all">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">⚔️ Battle!</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Initiate a deadly clash between two contestants and decide the outcome.
            </p>
            {/* Botón que redirige a la página para crear nueva batalla */}
            <Button asChild className="bg-purple-600 hover:bg-purple-500 text-white">
              <Link href="/battles/new">Start Battle</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tarjeta para ver historial */}
        <Card className="bg-zinc-900 border border-zinc-700 shadow-md hover:shadow-red-500/30 transition-all">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-red-300 mb-2">📜 View History</h2>
            <p className="text-sm text-zinc-400 mb-4">
              See all previous battles, winners, and bloody moments.
            </p>
            {/* Botón que redirige a la página del historial de batallas */}
            <Button asChild className="bg-red-600 hover:bg-red-500 text-white">
              <Link href="/battles/history">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}