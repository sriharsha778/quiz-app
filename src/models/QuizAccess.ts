import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  quizName: string;
  credentials: { name: string; password: string }[];
}

// Sub-schema for credentials
const CredentialSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { _id: false }
);

// Sub-schema for questions


const QuizSchema = new Schema<IQuiz>(
  {
    quizName: { type: String, required: true },
    credentials: { type: [CredentialSchema], required: true },
  },
  { timestamps: false }
);

export default mongoose.models.Quiz ||
  mongoose.model<IQuiz>("Quiz", QuizSchema);
