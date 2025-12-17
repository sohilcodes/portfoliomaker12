"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else {
        setUser(data.user);
        loadProfile(data.user.id);
      }
    });
  }, []);

  async function loadProfile(id: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setData(data);
  }

  async function saveProfile() {
    await supabase.from("profiles").upsert({
      id: user.id,
      username: data.username,
      full_name: data.full_name,
      job_title: data.job_title,
      bio: data.bio,
      skills: data.skills?.split(","),
    });
    alert("Profile Saved");
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl mb-4">Dashboard</h1>

      {["username", "full_name", "job_title", "bio", "skills"].map((f) => (
        <input
          key={f}
          placeholder={f}
          className="w-full mb-3 p-2 bg-zinc-800 rounded"
          value={data[f] || ""}
          onChange={(e) => setData({ ...data, [f]: e.target.value })}
        />
      ))}

      <button
        onClick={saveProfile}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Save
      </button>

      {data.username && (
        <p className="mt-4 text-sm">
          Public URL:{" "}
          <a
            href={`/p/${data.username}`}
            className="text-blue-400 underline"
          >
            /p/{data.username}
          </a>
        </p>
      )}
    </div>
  );
}
