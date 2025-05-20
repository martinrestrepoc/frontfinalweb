"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

type Dictator = {
  id: string;
  name: string;
  territory: string;
  number_of_slaves: number;
  loyalty_to_Carolina: number;
};

export default function DictatorsPage() {
  const [dictators, setDictators] = useState<Dictator[]>([]);

  const fetchDictators = async () => {
    try {
      const res = await api.get("/dictators");
      setDictators(res.data);
    } catch (error) {
      console.error("Error loading dictators", error);
    }
  };

  useEffect(() => {
    fetchDictators();
  }, []);

  const deleteDictator = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dictator?")) return;
    try {
      await api.delete(`/dictators/${id}`);
      alert("Dictator deleted!");
      fetchDictators();
    } catch (error) {
      alert("Error deleting dictator.");
      console.error("Delete failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400 drop-shadow">
          🧑‍✈️ Dictator Control Panel
        </h1>
        <Button asChild className="bg-purple-600 hover:bg-purple-500 text-white">
          <Link href="/dictators/new">+ New Dictator</Link>
        </Button>
      </div>

      <div className="border border-zinc-700 rounded-lg overflow-x-auto bg-zinc-900 shadow-lg">
        <table className="min-w-full text-sm text-left text-zinc-200">
          <thead className="bg-zinc-800 text-purple-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Territory</th>
              <th className="px-4 py-3"># Slaves</th>
              <th className="px-4 py-3">Loyalty</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dictators.map((d) => (
              <tr
                key={d.id}
                className="border-t border-zinc-700 hover:bg-zinc-800 transition"
              >
                <td className="px-4 py-2">{d.name}</td>
                <td className="px-4 py-2">{d.territory}</td>
                <td className="px-4 py-2">{d.number_of_slaves}</td>
                <td className="px-4 py-2">{d.loyalty_to_Carolina}</td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <Link href={`/dictators/${d.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-400 text-purple-300 hover:bg-purple-600/10"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDictator(d.id)}
                    className="bg-red-600 hover:bg-red-500 text-white"
                  >
                    Delete
                  </Button>
                  <Link href={`/dictators/${d.id}/contestants`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                    >
                      Manage Contestants
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}