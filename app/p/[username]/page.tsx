import { supabase } from "@/lib/supabaseClient";

export default async function PublicPage({ params }: any) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!data) return <div>User not found</div>;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold">{data.full_name}</h1>
        <p className="text-zinc-400">{data.job_title}</p>

        <p className="mt-4">{data.bio}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {data.skills?.map((s: string) => (
            <span
              key={s}
              className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
