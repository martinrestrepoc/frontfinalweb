"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

// Esquema de validación Zod para los campos del formulario de edición
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  territory: z.string().min(1, "Territory is required"),
  number_of_slaves: z.coerce.number().int().min(0),
  loyalty_to_Carolina: z.coerce.number().int().min(0).max(100),
  email: z.string().email("Invalid email"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

// Tipo inferido para los datos del formulario
type FormData = z.infer<typeof schema>;

export default function EditDictatorPage() {
  // Obtiene el parámetro id de la URL para cargar y actualizar el dictador
  const { id } = useParams();

  // useRouter para redireccionar tras editar
  const router = useRouter();

  // Estado para controlar la carga inicial
  const [loading, setLoading] = useState(true);

  // Configuración del formulario con validación
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // useEffect para cargar datos actuales del dictador y setearlos en el formulario
  useEffect(() => {
    const fetchDictator = async () => {
      try {
        const res = await api.get(`/dictators/${id}`);
        const data = res.data;
        setValue("name", data.name);
        setValue("territory", data.territory);
        setValue("number_of_slaves", data.number_of_slaves);
        setValue("loyalty_to_Carolina", data.loyalty_to_Carolina);
        setValue("email", data.email);
        setValue("password", ""); 
      } catch (err) {
        console.error("Error loading dictator", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDictator();
  }, [id, setValue]);

  // Función para enviar los cambios al backend
  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/dictators/${id}`, data);
      alert("Dictator updated!");
      router.push("/dictators"); // Redirige a la lista de dictadores
    } catch (err) {
      alert("Error updating dictator");
      console.error(err);
    }
  };

  // Mientras carga los datos, muestra mensaje
  if (loading) return <p className="p-6 text-white">Loading...</p>;

  // Renderizado del formulario para editar dictador
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />

      <div className="flex justify-center items-center mt-8">
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-6 drop-shadow">
            🛠️ Edit Dictator
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <Input placeholder="Territory" {...register("territory")} />
            {errors.territory && (
              <p className="text-red-500">{errors.territory.message}</p>
            )}

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