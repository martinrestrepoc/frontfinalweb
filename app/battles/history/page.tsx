"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";

type Battle = {
  id: string;
  contestant_1: string;
  contestant_2: string;
  winner_id: string;
  death_occurred: boolean;
  injuries: string;
  date: string;
};

type Contestant = {
  id: string;
  name: string;
};

export default function BattlesHistoryPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [nameMap, setNameMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [battleRes, contestantRes] = await Promise.all([
          api.get("/battles"),
          api.get("/contestants"),
        ]);

        setBattles(battleRes.data);

        const map = new Map<string, string>();
        contestantRes.data.forEach((c: Contestant) => {
          map.set(c.id, c.name);
        });

        setNameMap(map);
      } catch (error) {
        console.error("Error loading battle history or contestants", error);
      }
    };

    fetchData();
  }, []);

  const getName = (id: string) => nameMap.get(id) || "Unknown";

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center drop-shadow">
        📜 Battle History
      </h1>

      <div className="border border-zinc-700 rounded-lg overflow-x-auto bg-zinc-900">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-zinc-800 text-purple-300">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Contestant 1</th>
              <th className="px-4 py-2">Contestant 2</th>
              <th className="px-4 py-2">Winner</th>
              <th className="px-4 py-2">Deaths</th>
              <th className="px-4 py-2">Injuries</th>
            </tr>
          </thead>
          <tbody>
            {battles.map((battle) => (
              <tr key={battle.id} className="border-t border-zinc-700 hover:bg-zinc-800">
                <td className="px-4 py-2">{format(new Date(battle.date), "yyyy-MM-dd")}</td>
                <td className="px-4 py-2">{getName(battle.contestant_1)}</td>
                <td className="px-4 py-2">{getName(battle.contestant_2)}</td>
                <td className="px-4 py-2">{getName(battle.winner_id)}</td>
                <td className="px-4 py-2">{battle.death_occurred ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{battle.injuries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}