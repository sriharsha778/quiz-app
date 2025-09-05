import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECREAT!);

export async function POST(request: Request) {
  try { 
    const { username, email, password } = await request.json();
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Use SignJWT to create the token
    const token = await new SignJWT({ 
      id: newUser._id.toString(), // Convert ObjectId to string
      email: newUser.email 
    })
      .setProtectedHeader({ alg: "HS256" }) // Use a specific algorithm
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "User created successfully" }, { status: 201 });
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