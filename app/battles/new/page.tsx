"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";

type Contestant = {
  id: string;
  name: string;
  nickname: string;
};

const schema = z.object({
  contestant_1: z.string().uuid(),
  contestant_2: z.string().uuid(),
  winner_id: z.string().uuid(),
  death_occurred: z.coerce.boolean(),
  injuries: z.string().min(1, "Injuries description is required"),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export default function NewBattlePage() {
  const [contestants, setContestants] = useState<Contestant[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const res = await api.get("/contestants");
        setContestants(res.data);
      } catch (error) {
        console.error("Error fetching contestants", error);
      }
    };
    fetchContestants();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/battles", {
        ...data,
        date: format(data.date, "yyyy-MM-dd"), 
      });
      alert("Battle created successfully!");
    } catch (err: any) {
      alert("Error creating battle.");
      console.error(err.response?.data || err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center drop-shadow">
            ⚔️ Create New Battle
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <select {...register("contestant_1")} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600">
              <option value="">Select Contestant 1</option>
              {contestants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nickname})
                </option>
              ))}
            </select>
            {errors.contestant_1 && <p className="text-red-500">{errors.contestant_1.message}</p>}

            <select {...register("contestant_2")} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600">
              <option value="">Select Contestant 2</option>
              {contestants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nickname})
                </option>
              ))}
            </select>
            {errors.contestant_2 && <p className="text-red-500">{errors.contestant_2.message}</p>}

            <select {...register("winner_id")} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600">
              <option value="">Select Winner</option>
              {contestants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nickname})
                </option>
              ))}
            </select>
            {errors.winner_id && <p className="text-red-500">{errors.winner_id.message}</p>}

            <select {...register("death_occurred")} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-600">
              <option value="false">No Death</option>
              <option value="true">Death Occurred</option>
            </select>
            {errors.death_occurred && <p className="text-red-500">{errors.death_occurred.message}</p>}

            <Input placeholder="Injuries" {...register("injuries")} />
            {errors.injuries && <p className="text-red-500">{errors.injuries.message}</p>}

            {/* Calendario */}
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-600",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-zinc-900 border border-zinc-700 text-white">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-red-500">{errors.date.message}</p>}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              Submit Battle
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}