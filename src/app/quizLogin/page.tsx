"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [quizName, setQuizName] = useState("");
  const [username, setUname] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!quizName || !username || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/quizLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizName,
          userName: username,
          password,
        }),
      });

      if (res.ok) {
        toast.success("Login Successful 🎉");
        router.push("/Home");
      } else {
        toast.error("Invalid credentials, please try again");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white p-10 w-full max-w-md border border-gray-200 rounded-2xl shadow-lg gap-6"
      >
        <h1 className="text-3xl font-bold text-center text-purple-600">
          Quiz Login
        </h1>

        <input
          type="text"
          className="p-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition"
          placeholder="Enter Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          disabled={loading}
          required
        />

        <input
          className="p-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUname(e.target.value)}
          disabled={loading}
          required
        />

        <input
          className="p-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium rounded-xl py-3 cursor-pointer flex justify-center items-center gap-2 hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="relative flex items-center justify-center">
              {/* Outer spinning ring with glow */}
              <div className="h-6 w-6 rounded-full border-4 border-t-transparent border-white animate-spin shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              {/* Inner glowing circle */}
              <div className="absolute h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"></div>
            </div>
          ) : (
            "Join Quiz"
          )}
        </button>
      </form>
    </div>
  );
}
