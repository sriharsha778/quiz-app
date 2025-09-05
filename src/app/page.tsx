"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-blue-400">Home Page</h1>
      <button onClick={handleClick}>Go to Dashboard</button>
    </div>
  );
}
