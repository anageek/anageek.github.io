export const dynamic = 'force-static';
import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const success = await login(formData);

  if (success) {
    return NextResponse.json({ message: "Logged in" }, { status: 200 });
  }

  return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
}
