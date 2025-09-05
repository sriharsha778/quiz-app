"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen gap-4 bg-pink-400">
      <h1 className="font-bold text-3xl">What do You Want To Do</h1>
      <div>
        <button
          onClick={() => router.push("/createQuiz")}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 m-2"
        >
          Create Quiz
        </button>
        <button
          onClick={() => router.push("/quizLogin")}
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 m-2"
        >
          Join Quiz
        </button>
      </div>
    </div>
  );
}
