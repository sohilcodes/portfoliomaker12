"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Username rules:
 * - letters, numbers, underscore only
 * - must NOT start with number
 */
function isValidUsername(username: string) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(username);
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>({
    username: "",
    full_name: "",
    job_title: "",
    bio: "",
    skills: "",
  });

  const router = useRouter();

  // 1️⃣ Check login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        loadProfile(data.user.id);
      }
    });
  }, [router]);

  // 2️⃣ Load existing profile (if any)
  async function loadProfile(id: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (profile) {
      setData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        job_title: profile.job_title || "",
        bio: profile.bio || "",
        skills: profile.skills ? profile.skills.join(",") : "",
      });
    }
  }

  // 3️⃣ Save / Update profile
  async function saveProfile() {
    if (!data.username) {
      alert("Username required");
      return;
    }

    if (!isValidUsername(data.username)) {
      alert(
        "Invalid username!\n\nRules:\n- Only letters, numbers, underscore (_)\n- Must not start with a number"
      );
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: data.username.toLowerCase(),
      full_name: data.full_name,
      job_title: data.job_title,
      bio: data.bio,
      skills: data.skills
        ? data.skills.split(",").map((s: string) => s.trim())
        : [],
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Profile saved successfully 🎉");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Username */}
      <input
        className="w-full mb-3 p-2 bg-zinc-800 rounded"
        placeholder="Username (example: sohil_khan)"
        value={data.username}
        onChange={(e) =>
          setData({ ...data, username: e.target.value })
        }
      />

      {/* Full Name */}
      <input
        className="w-full mb-3 p-2 bg-zinc-800 rounded"
        placeholder="Full Name"
        value={data.full_name}
        onChange={(e) =>
          setData({ ...data, full_name: e.target.value })
        }
      />

      {/* Job Title */}
      <input
        className="w-full mb-3 p-2 bg-zinc-800 rounded"
        placeholder="Job Title"
        value={data.job_title}
        onChange={(e) =>
          setData({ ...data, job_title: e.target.value })
        }
      />

      {/* Bio */}
      <textarea
        className="w-full mb-3 p-2 bg-zinc-800 rounded"
        placeholder="Bio"
        rows={3}
        value={data.bio}
        onChange={(e) =>
          setData({ ...data, bio: e.target.value })
        }
      />

      {/* Skills */}
      <input
        className="w-full mb-4 p-2 bg-zinc-800 rounded"
        placeholder="Skills (comma separated)"
        value={data.skills}
        onChange={(e) =>
          setData({ ...data, skills: e.target.value })
        }
      />

      {/* Save Button */}
      <button
        onClick={saveProfile}
        className="bg-blue-600 px-6 py-2 rounded"
      >
        Save Profile
      </button>

      {/* Public Link */}
      {data.username && (
        <p className="mt-4 text-sm text-zinc-400">
          Public URL:{" "}
          <a
            href={`/p/${data.username.toLowerCase()}`}
            target="_blank"
            className="text-blue-400 underline"
          >
            /p/{data.username.toLowerCase()}
          </a>
        </p>
      )}
    </div>
  );
}
