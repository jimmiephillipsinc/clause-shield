"use client"
import { useState } from "react"
import jsPDF from "jspdf"

type Trap = {
  id: number
  severity: "HIGH" | "MEDIUM" | "CRITICAL"
  title: string
  why: string
  fix: string
}

export default function Page() {
  const [text, setText] = useState("")
  const [traps, setTraps] = useState<Trap[]>([])
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  const analyze = () => {
    const t = text.toLowerCase()
    const found: Trap[] = []

    if (t.includes("non-compete") || t.includes("non compete")) {
      const months = text.match(/(\d+)\s*months?/i)?.[1] || "24"
      const place = t.includes("united states") || t.includes("u.s.") ? "United States" : t.includes("texas") ? "Texas" : "United States"
      found.push({
        id: 1,
        severity: "HIGH",
        title: `Non-compete ${months} months / ${place}`,
        why: `Blocks you from working for competitors nationwide for ${months} months after you leave.`,
        fix: "Negotiate to 6 months, city-only, and remove.",
      })
    }

    if (t.includes("arbitration") || t.includes("jams") || t.includes("aaa")) {
      const venue = text.match(/in\s+([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)?)/)?.[1] || "out-of-state"
      found.push({
        id: 2,
        severity: "MEDIUM",
        title: `Binding arbitration in ${venue}`,
        why: "You waive jury trial and must travel to dispute.",
        fix: "Ask for mediation first, venue in Harris County, TX.",
      })
    }

    if (t.includes("auto-renew") || t.includes("automatically renew") || t.includes("renewal")) {
      const days = text.match(/(\d+)\s*days?\s*(?:prior|notice)/i)?.[1] || "90"
      found.push({
        id: 3,
        severity: "MEDIUM",
        title: `Auto-renewal - ${days}-day notice trap`,
        why: "Forgets to cancel = locked for another year.",
        fix: "30-day notice + email reminder.",
      })
    }

    if (t.includes("indemnif")) {
      found.push({
        id: 4,
        severity: "HIGH",
        title: "One-sided unlimited indemnification",
        why: "You pay all legal costs even if not your fault.",
        fix: "Make mutual, cap at fees paid.",
      })
    }

    if (t.includes("termination fee") || t.match(/100%\s*.*remaining/)) {
      found.push({
        id: 5,
        severity: "CRITICAL",
        title: "100% termination fee",
        why: "Quit early = pay full contract value.",
        fix: "Remove fee or make pro-rated.",
      })
    }

    setTraps(found)
    setHasAnalyzed(true)
    setIsPaid(false) // reset on new analyze
  }

  const summaryText = () => {
    if (traps.length === 0) return "No obvious traps found, but review carefully."
    const parts = traps.map(tr => tr.title.toLowerCase())
    return `This agreement says you ${parts.join(", ")}.`
  }

  const copyFix = () => {
    const msg = `Can we change non-compete to 6 months / Houston only, change arbitration to Harris County mediation, and make renewal 30-day opt-in?`
    navigator.clipboard.writeText(msg)
    alert("Fix request copied!")
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Clause Shield - Trap Report", 15, 20)
    doc.setFontSize(11)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 30)
    doc.text(`Found: ${traps.length} traps`, 15, 37)
    doc.setFontSize(10)
    doc.text(summaryText(), 15, 45, { maxWidth: 180 })

    let y = 60
    traps.forEach((trap, i) => {
      if (y > 250) { doc.addPage(); y = 20 }
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(`${i+1}. [${trap.severity}] ${trap.title}`, 15, y)
      y += 6
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(`Why: ${trap.why}`, 15, y, { maxWidth: 180 })
      y += 8
      doc.text(`Fix: ${trap.fix}`, 15, y, { maxWidth: 180 })
      y += 12
    })

    doc.save(`Clause-Shield-Report-${Date.now()}.pdf`)
  }

  const handleUnlock = async () => {
    // FOR NOW - unlock instantly for testing. Later replace with Stripe.
    // const res = await fetch('/api/checkout', { method: 'POST' })
    // const data = await res.json()
    // window.location.href = data.url
    setIsPaid(true)
  }

  const visibleTraps = isPaid ? traps : traps.slice(0, 2)
  const hiddenCount = traps.length - visibleTraps.length

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10">
        <h1 className="text-xl font-bold tracking-widest">CLAUSE SHIELD <span className="text-white/40 text-sm font-normal ml-2">Find the traps before you sign.</span></h1>
        <div className="text-xs text-white/40">Not legal advice • 100% private • No data stored</div>
      </header>

      <div className="flex-1 grid md:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left */}
        <div className="bg-[#111a2e] rounded-2xl p-5 border border-white/10">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span>CONTRACT TEXT</span>
            <span>{text.length} chars</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your scary contract here... (non-compete, arbitration, auto-renewal, etc)"
            className="w-full h-[380px] bg-black/50 rounded-xl p-4 text-sm outline-none border border-white/10 focus:border-red-500/50"
          />
          <button onClick={analyze} className="w-full mt-4 bg-[#ff2d55] hover:bg-[#ff1f4b] text-white font-bold py-3 rounded-xl">
            🔍 Analyze for Traps
          </button>
          <div className="text-[11px] text-white/30 mt-3 text-center">✓ No data stored • ✓ Not legal advice • ✓ 100% private</div>
        </div>

        {/* Right */}
        <div className="bg-white text-black rounded-2xl p-5">
          {!hasAnalyzed ? (
            <div className="h-full flex items-center justify-center text-center text-black/40">
              <div>
                <div className="text-5xl mb-4">🛡️</div>
                <p className="font-bold">Paste a contract to see traps</p>
                <p className="text-sm mt-2">We detect non-compete, arbitration, auto-renewal, indemnity, termination fees</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded">PLAIN ENGLISH SUMMARY</div>
                <div className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded">{traps.length} TRAPS FOUND</div>
              </div>

              <div className="border border-black rounded-xl p-3 text-sm mb-4">
                {summaryText()}
              </div>

              {traps.slice(0, isPaid ? traps.length : 2).map(trap => (
                <div key={trap.id} className="border-l-4 pl-3 py-3 mb-3 rounded-r-lg bg-red-50/50" style={{ borderColor: trap.severity === "CRITICAL" ? "#ef4444" : trap.severity === "HIGH" ? "#ef4444" : "#eab308" }}>
                  <div className="flex gap-2 items-center mb-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded text-white ${trap.severity === "CRITICAL" ? "bg-red-600" : trap.severity === "HIGH" ? "bg-red-500" : "bg-yellow-500 text-black"}`}>{trap.severity}</span>
                    <span className="font-bold text-sm">TRAP {trap.id}: {trap.title}</span>
                  </div>
                  <div className="text-xs text-black/60">⚠️ {trap.why}</div>
                  <div className="text-xs text-green-700 mt-1"><b>FIX:</b> {trap.fix}</div>
                </div>
              ))}

              {!isPaid && hiddenCount > 0 && (
                <div className="bg-black text-white rounded-xl p-4 text-center mb-4">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="font-bold">+{hiddenCount} more critical traps hidden</p>
                  <p className="text-xs text-white/60 mt-1">Pay $9 to unlock full report + PDF</p>
                  <button onClick={handleUnlock} className="mt-3 bg-[#ff2d55] px-5 py-2 rounded-full font-bold text-sm">
                    Unlock for $9 - Instant Access
                  </button>
                </div>
              )}

              <div className="bg-black text-white rounded-xl p-4 mt-4">
                <div className="text-[11px] tracking-widest text-white/50 mb-2">RECOMMENDATION</div>
                <p className="text-sm text-white/90">Send this: "Can we change non-compete to 6 months / Houston only, change arbitration to Harris County mediation, and make renewal 30-day opt-in?"</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={copyFix} className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs">Copy Fix Request</button>
                  <button onClick={downloadPDF} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full font-bold text-xs">📄 Download PDF Report</button>
                </div>
                {!isPaid && <p className="text-[10px] text-white/40 mt-2">PDF includes watermark until paid. Pay $9 to remove.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

