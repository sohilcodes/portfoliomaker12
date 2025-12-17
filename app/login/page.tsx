"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else router.push("/dashboard");
  }

  async function signup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Signup successful, now login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-80">
        <h1 className="text-xl mb-4">Login / Signup</h1>

        <input
          placeholder="Email"
          className="w-full mb-3 p-2 bg-zinc-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-zinc-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 py-2 rounded mb-2"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full bg-zinc-700 py-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
