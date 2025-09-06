import { connectDB } from "@/lib/mongodb";
import QuizAccess from "@/models/QuizAccess";

export async function POST(req: Request) {
  await connectDB();

  const { quizName, credentials } = await req.json();

  if (!quizName || !credentials) {
    return new Response(JSON.stringify({ message: "Quiz name and credentials required" }), { status: 400 });
  }

  try {
    const existingQuiz = await QuizAccess.findOne({ quizName });
    console.log(existingQuiz);
    
    if (existingQuiz) {
      return new Response(JSON.stringify({ message: "Quiz already exists" }), { status: 400 });
    }

    const quiz = new QuizAccess({ quizName, credentials });
    await quiz.save();
    return new Response(JSON.stringify({ message: "Quiz created successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error saving quiz:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
