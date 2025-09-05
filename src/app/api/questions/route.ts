import { connectDB } from "@/lib/mongodb";
import QuizQuestion from "@/models/QuizQuestions";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { quizName, questions } = await req.json();

    if (!quizName || !questions || !Array.isArray(questions)) {
      return new Response(
        JSON.stringify({ message: "Quiz name and questions are required" }),
        { status: 400 }
      );
    }

    const existing = await QuizQuestion.findOne({ quizName });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Questions for this quiz already exist" }),
        { status: 400 }
      );
    }

    const newQuestions = new QuizQuestion({ quizName, questions });
    await newQuestions.save();

    return new Response(
      JSON.stringify({ message: "Questions saved successfully!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving questions:", err);
    return new Response(
      JSON.stringify({ message: "Failed to save questions" }),
      { status: 500 }
    );
  }
}
