"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  territory: z.string().min(1, "Territory is required"),
  number_of_slaves: z.coerce.number().int().min(0),
  loyalty_to_Carolina: z.coerce.number().int().min(0).max(100),
  email: z.string().email("Invalid email"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

type FormData = z.infer<typeof schema>;

export default function NewDictatorPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/dictators", data);
      alert("Dictator created!");
    } catch (err) {
      alert("Error creating dictator.");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />

      <div className="flex justify-center items-center mt-8">
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-6 drop-shadow">
            🧠 Create New Dictator
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <Input placeholder="Territory" {...register("territory")} />
            {errors.territory && <p className="text-red-500">{errors.territory.message}</p>}

            <Input
              type="number"
              placeholder="Number of Slaves"
              {...register("number_of_slaves")}
            />
            {errors.number_of_slaves && (
              <p className="text-red-500">{errors.number_of_slaves.message}</p>
            )}

            <Input
              type="number"
              placeholder="Loyalty to Carolina (1–100)"
              {...register("loyalty_to_Carolina")}
            />
            {errors.loyalty_to_Carolina && (
              <p className="text-red-500">{errors.loyalty_to_Carolina.message}</p>
            )}

            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <Input type="password" placeholder="Password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              Create Dictator
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}