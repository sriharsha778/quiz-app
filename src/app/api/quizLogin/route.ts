import { connectDB } from "@/lib/mongodb";
import QuizAccess from "@/models/QuizAccess";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {

    const { quizName, userName, password } = await request.json();
    connectDB();

    const quiz = await QuizAccess.findOne({ quizName });
    console.log(quiz);
    
    if (!quiz) {
        return new Response(JSON.stringify({ message: "Quiz not found." }), { status: 404 });
    }   
    const user = quiz.credentials.find((cred: any) => cred.name === userName);
    if (!user) {
        return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if(passwordMatch) {
        return new Response(JSON.stringify({ message: "Login successful!" }), { status: 200 });
    }else{
        return new Response(JSON.stringify({ message: "Invalid password ." }), { status: 401 });
    }
    return new Response(JSON.stringify({ message: "Login failed." }), { status: 400 });

}