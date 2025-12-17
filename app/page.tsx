import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Portfolio Maker</h1>
      <Link
        href="/login"
        className="bg-blue-600 px-6 py-2 rounded"
      >
        Get Started
      </Link>
    </main>
  );
}
