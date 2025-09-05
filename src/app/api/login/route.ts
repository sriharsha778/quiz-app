import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECREAT!;
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Correctly chain the jose methods and call sign once
    const token = await new SignJWT({
      id: user._id.toString(), // Convert ObjectId to a string
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET_KEY);

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
    
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}