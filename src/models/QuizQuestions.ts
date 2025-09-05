import mongoose, { Schema, Document } from "mongoose";

export interface IQuizQuestion extends Document {
  quizName: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    quizName: { type: String, required: true, unique: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { timestamps: false }
);

export default mongoose.models.QuizQuestion ||
  mongoose.model<IQuizQuestion>("QuizQuestion", QuizQuestionSchema);
