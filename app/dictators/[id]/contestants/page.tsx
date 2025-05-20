"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Contestant = {
  id: string;
  name: string;
  nickname: string;
  origin: string;
  strength: number;
  agility: number;
  status: string;
};

export default function ContestantsPage() {
  const { id } = useParams();
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [dictatorName, setDictatorName] = useState("");

  const fetchContestants = async () => {
    try {
      const res = await api.get(`/dictators/${id}/contestants`);
      setContestants(res.data);
    } catch (error) {
      console.error("Error fetching contestants", error);
    }
  };

  const fetchDictatorName = async () => {
    try {
      const res = await api.get(`/dictators/${id}`);
      setDictatorName(res.data.name);
    } catch (error) {
      console.error("Error loading dictator", error);
    }
  };

  const handleDelete = async (contestantId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this contestant?");
    if (!confirm) return;

    try {
      await api.delete(`/contestants/${contestantId}`);
      alert("Contestant deleted!");
      fetchContestants();
    } catch (error) {
      alert("Error deleting contestant.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContestants();
      fetchDictatorName();
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-400 drop-shadow">
          🧍 Contestants of {dictatorName || "..."}
        </h1>
        <Button asChild className="bg-purple-600 hover:bg-purple-500">
          <Link href={`/dictators/${id}/contestants/new`}>+ New Contestant</Link>
        </Button>
      </div>

      <div className="border border-zinc-700 bg-zinc-900 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left text-zinc-200">
          <thead className="bg-zinc-800 text-purple-300">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Nickname</th>
              <th className="px-4 py-2">Origin</th>
              <th className="px-4 py-2">Strength</th>
              <th className="px-4 py-2">Agility</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contestants.map((c) => (
              <tr key={c.id} className="border-t border-zinc-700 hover:bg-zinc-800">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.nickname}</td>
                <td className="px-4 py-2">{c.origin}</td>
                <td className="px-4 py-2">{c.strength}</td>
                <td className="px-4 py-2">{c.agility}</td>
                <td className="px-4 py-2">{c.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Link href={`/dictators/${id}/contestants/${c.id}/edit`}>
                    <Button size="sm" variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-600/10">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}