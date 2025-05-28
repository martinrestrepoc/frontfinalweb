"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";

// Esquema Zod para validar los datos del formulario de edición del contestant
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().min(1, "Nickname is required"),
  origin: z.string().min(1, "Origin is required"),
  strength: z.coerce.number().min(1).max(100),
  agility: z.coerce.number().min(1).max(100),
  wins: z.coerce.number().min(0),
  losses: z.coerce.number().min(0),
  status: z.enum(["Alive", "Dead", "Escaped", "Free"]),
});

// Tipo TypeScript inferido del esquema
type FormData = z.infer<typeof schema>;

export default function EditContestantPage() {
  // Obtiene los parámetros de la URL (id del dictador y contestant)
  const { id, contestantId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Configuración del formulario react-hook-form con validación Zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Efecto para cargar los datos del contestant y setearlos en el formulario
  useEffect(() => {
    const fetchContestant = async () => {
      try {
        const res = await api.get(`/contestants/${contestantId}`);
        const data = res.data;
        setValue("name", data.name);
        setValue("nickname", data.nickname);
        setValue("origin", data.origin);
        setValue("strength", data.strength);
        setValue("agility", data.agility);
        setValue("wins", data.wins);
        setValue("losses", data.losses);
        setValue("status", data.status);
      } catch (err) {
        console.error("Error loading contestant", err);
      } finally {
        setLoading(false);
      }
    };

    if (contestantId) fetchContestant();
  }, [contestantId, setValue]);

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/contestants/${contestantId}`, data);
      alert("Contestant updated!");
      router.push(`/dictators/${id}/contestants`);
    } catch (err: any) {
      alert("Error updating contestant.");
      console.error(err.response?.data || err);
    }
  };

  // Mostrar mensaje mientras carga los datos del contestant
  if (loading) return <p className="p-6 text-white">Loading...</p>;

  // Renderizado del formulario con los inputs conectados y mensajes de error
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />
      <div className="flex justify-center items-center mt-8">
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-6 drop-shadow">
            ✏️ Edit Contestant
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <Input placeholder="Nickname" {...register("nickname")} />
            {errors.nickname && <p className="text-red-500">{errors.nickname.message}</p>}

            <Input placeholder="Origin" {...register("origin")} />
            {errors.origin && <p className="text-red-500">{errors.origin.message}</p>}

            <Input type="number" placeholder="Strength" {...register("strength")} />
            {errors.strength && <p className="text-red-500">{errors.strength.message}</p>}

            <Input type="number" placeholder="Agility" {...register("agility")} />
            {errors.agility && <p className="text-red-500">{errors.agility.message}</p>}

            <Input type="number" placeholder="Wins" {...register("wins")} />
            {errors.wins && <p className="text-red-500">{errors.wins.message}</p>}

            <Input type="number" placeholder="Losses" {...register("losses")} />
            {errors.losses && <p className="text-red-500">{errors.losses.message}</p>}

            <select
              {...register("status")}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600"
            >
              <option value="">Select Status</option>
              <option value="Alive">Alive</option>
              <option value="Escaped">Escaped</option>
              <option value="Dead">Dead</option>
              <option value="Free">Free</option>
            </select>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
            >
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}