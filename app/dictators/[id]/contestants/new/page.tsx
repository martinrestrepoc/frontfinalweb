"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().min(1, "Nickname is required"),
  origin: z.string().min(1, "Origin is required"),
  strength: z.coerce.number().min(1).max(100),
  agility: z.coerce.number().min(1).max(100),
  wins: z.coerce.number().min(0),
  losses: z.coerce.number().min(0),
  status: z.enum(["Alive", "Dead", "Escaped", "Free"]),
  email: z.string().email("Invalid email"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

type FormData = z.infer<typeof schema>;

export default function NewContestantPage() {
  const { id } = useParams(); // id del dictador
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post(`/contestants/dictators/${id}/contestants`, data); 
      alert("Contestant created!");
      router.push(`/dictators/${id}/contestants`);
    } catch (err: any) {
        alert("Error creating contestant.");
        console.error(err.response?.data || err);
      }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />

      <div className="flex justify-center items-center mt-8">
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-6 drop-shadow">
            ⚔️ Create New Contestant
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <Input placeholder="Nickname" {...register("nickname")} />
            {errors.nickname && <p className="text-red-500">{errors.nickname.message}</p>}

            <Input placeholder="Origin" {...register("origin")} />
            {errors.origin && <p className="text-red-500">{errors.origin.message}</p>}

            <Input type="number" placeholder="Strength (1–100)" {...register("strength")} />
            {errors.strength && <p className="text-red-500">{errors.strength.message}</p>}

            <Input type="number" placeholder="Agility (1–100)" {...register("agility")} />
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

            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <Input type="password" placeholder="Password" {...register("password")} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
            >
              Create Contestant
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}