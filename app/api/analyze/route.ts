import { NextResponse } from "next/server"
export async function POST(req:Request){
  const {text} = await req.json()
  // TODO: Replace with real Ollama call: await fetch("http://localhost:11434/api/generate",...)
  const result = `PLAIN ENGLISH:\n${text.slice(0,300)}\n\n🚩 TRAP 1 [HIGH]: Non-compete 24 months / 100 miles is overbroad for Texas.\n🚩 TRAP 2 [MEDIUM]: Delaware arbitration = expensive to dispute.\n🚩 TRAP 3 [MEDIUM]: Auto-renewal 60 days traps you.\n\nRECOMMENDATION: Ask for 12 months, 25 miles, Texas venue, and 30-day renewal notice.\n\nNEXT STEP: Copy this and ask landlord/employer to amend.`
  return NextResponse.json({result})
}
