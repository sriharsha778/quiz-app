"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (mode === "signup" && !username)) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const endpoint = mode === "signup" ? "/api/signup" : "/api/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? { username, email, password }
            : { email, password }
        ),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success(
          mode === "signup"
            ? "Signed up successfully"
            : "Logged in successfully"
        );
        router.push("/Home");
      } else {
        toast.error(data?.error || "Error occurred");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-4 text-white">
      {/* Form */}
      <form
        className="flex flex-col bg-gray-200 text-black rounded-4xl gap-4 p-12 z-10 relative"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {mode === "signup" && (
          <input
            type="text"
            className="border-2 border-gray-600 outline-0 rounded-2xl p-3"
            onChange={(e) => setUname(e.target.value)}
            placeholder="Username"
            disabled={loading}
          />
        )}

        <input
          type="text"
          className="border-2 border-gray-600 outline-0 rounded-2xl p-3"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={loading}
        />

        <input
          type="password"
          className="border-2 border-gray-600 outline-0 rounded-2xl p-3"
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          disabled={loading}
        />

        <button
          type="submit"
          className="bg-purple-300 rounded-2xl p-3 cursor-pointer flex justify-center items-center gap-1"
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 border-black border-2 rounded-full animate-spin ">
              <div className=" h-4 w-4 ml-2  bg-purple-300"></div>
            </div>
          ) : mode === "login" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-sm text-center">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="underline text-blue-500 cursor-pointer"
                disabled={loading}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="underline text-blue-500 cursor-pointer"
                disabled={loading}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
