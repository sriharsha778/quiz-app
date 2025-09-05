"use client";

import ToggleSwitch from "@/components/ToggleSwitch";
import { useState } from "react";
import Papa from "papaparse";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import QuizLoginDisplayer from "@/components/QuizLoginDisplayer";
import QuestionDisplayer from "@/components/QuestionDisplayer";

type QuizRow = { [key: string]: string };

export default function CreateQuiz() {
  const [quizName, setQuizName] = useState("");
  const [credentialOnly, setCredentialOnly] = useState(false);

  const [credFile, setCredFile] = useState<File | null>(null);
  const [credInfo, setCredInfo] = useState<QuizRow[]>([]);

  const [quesFile, setQuesFile] = useState<File | null>(null);
  const [quesInfo, setQuesInfo] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const parseCSV = (
    file: File,
    setFile: (f: File) => void,
    setData: (d: QuizRow[]) => void
  ) => {
    if (file.type !== "text/csv") return toast.error("Only CSV allowed");
    setFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res: any) => setData(res.data),
    });
  };

  const parseJSON = (
    file: File,
    setFile: (f: File) => void,
    setData: (d: any[]) => void
  ) => {
    if (file.type !== "application/json")
      return toast.error("Only JSON allowed");
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) return toast.error("JSON must be an array");
        setData(data);
      } catch {
        toast.error("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (credentialOnly && (!credFile || credInfo.length === 0)) {
      toast.error("Upload valid credentials CSV");
      setLoading(false);
      return;
    }
    if (!quesFile || quesInfo.length === 0) {
      toast.error("Upload valid questions JSON");
      setLoading(false);
      return;
    }

    const hashedCreds = credInfo.map((row) => ({
      name: row.name,
      password: row.password ? bcrypt.hashSync(row.password, 10) : "",
    }));

    try {
      const quizRes = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizName, credentials: hashedCreds }),
      });
      if (!quizRes.ok) throw new Error("Failed to save quiz metadata");

      const quesRes = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizName: quizName, questions: quesInfo }),
      });
      if (!quesRes.ok) throw new Error("Failed to save questions");

      toast.success("Quiz created successfully!");
      router.push("/Home");
    } catch (err) {
      console.error(err);
      toast.error("Error saving quiz" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black flex flex-col items-center justify-center min-h-screen p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md bg-gray-50 shadow-xl rounded-3xl p-8 gap-6"
      >
        <h1 className="text-3xl font-extrabold text-purple-700 text-center">
          Create Your Own Quiz
        </h1>

        <input
          type="text"
          placeholder="Enter Quiz Name"
          className="w-full text-black p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setQuizName(e.target.value)}
          required
        />

        <div className="flex justify-between items-center w-full">
          <label className="font-medium">Credential Only:</label>
          <ToggleSwitch
            isActive={credentialOnly}
            onToggle={setCredentialOnly}
          />
        </div>

        {credentialOnly && (
          <div className="w-full">
            <h2 className="text-gray-700 font-semibold mb-2">
              Upload Credentials CSV
            </h2>
            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                e.target.files &&
                parseCSV(e.target.files[0], setCredFile, setCredInfo)
              }
              className="hidden"
              id="credUpload"
            />
            <label
              htmlFor="credUpload"
              className="block p-6 w-full h-32 border-2 border-dashed border-gray-400 rounded-xl text-gray-600 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition"
            >
              {credFile
                ? credFile.name
                : "📂 Drag & drop CSV or click to upload"}
            </label>

            {credInfo.length > 0 && <QuizLoginDisplayer credInfo={credInfo} />}
          </div>
        )}

        <div className="w-full">
          <h2 className="text-gray-700 font-semibold mb-2">
            Upload Questions JSON
          </h2>
          <input
            type="file"
            accept=".json"
            onChange={(e) =>
              e.target.files &&
              parseJSON(e.target.files[0], setQuesFile, setQuesInfo)
            }
            className="hidden"
            id="quesUpload"
          />
          <label
            htmlFor="quesUpload"
            className="block p-6 w-full h-32 border-2 border-dashed border-gray-400 rounded-xl text-gray-600 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition"
          >
            {quesFile
              ? quesFile.name
              : "📂 Drag & drop JSON or click to upload"}
          </label>

          {quesInfo.length > 0 && <QuestionDisplayer questions={quesInfo} />}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-purple-500 to-purple-700 flex justify-center items-center gap-2 hover:from-purple-600 hover:to-purple-800 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="h-6 w-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Create Quiz"
          )}
        </button>
      </form>
    </div>
  );
}
