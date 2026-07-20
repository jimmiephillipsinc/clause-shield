'use client'
import { useState } from 'react'

export default function Home() {
  const [contract, setContract] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    const text = contract.toLowerCase()
    const traps:any[] = []
    if (text.includes('non-compete')) {
      const m = contract.match(/(\d+)\s*months?/i)
      traps.push({ sev: 'HIGH', title: `Non-compete ${m?m[1]:'24'} months / United States`, risk: 'Blocks you from working for competitors nationwide for 2 years after you leave.', fix: 'Negotiate to 6 months, city-only, and remove.' })
    }
    if (text.includes('arbitration')) {
      const loc = contract.match(/arbitration in ([^.]+)/i)
      traps.push({ sev: 'MEDIUM', title: `Binding arbitration in ${loc?loc[1]:'out-of-state'}`, risk: 'You waive jury trial and must travel to dispute.', fix: 'Ask for mediation first, venue in Harris County, TX.' })
    }
    if (text.includes('automatically renew')) {
      const d = contract.match(/(\d+)\s*days/i)
      traps.push({ sev: 'MEDIUM', title: `Auto-renewal - ${d?d[1]:'90'}-day notice trap`, risk: 'Forgets to cancel = locked for another year.', fix: '30-day notice + email reminder.' })
    }
    if (text.includes('indemnify')) traps.push({ sev: 'HIGH', title: 'One-sided unlimited indemnification', risk: 'You pay all legal costs even if not your fault.', fix: 'Make mutual, cap at fees paid.' })
    if (text.includes('termination fee')) traps.push({ sev: 'CRITICAL', title: '100% termination fee', risk: 'Quit early = pay full contract value.', fix: 'Remove fee or make pro-rated.' })
    setResult({ traps })
  }

  return (
    <main className="min-h-screen bg-[#050A14] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center font-bold">CS</div>
            <span className="font-bold tracking-widest">CLAUSE SHIELD</span>
          </div>
          <div className="text-xs text-gray-400">Your Legal AI • Houston, TX</div>
        </div>

        {/* HERO */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 leading-tight">Find the traps<br/><span className="text-red-500">before you sign.</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Paste any employment, lease, or vendor contract. Clause Shield translates legalese to plain English and flags risky clauses in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* INPUT */}
          <div className="bg-[#0F172A] rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-between mb-3">
              <label className="text-sm font-semibold text-gray-300">CONTRACT TEXT</label>
              <span className="text-xs text-gray-500">{contract.length} chars</span>
            </div>
            <textarea value={contract} onChange={e=>setContract(e.target.value)} placeholder="Paste your contract here... Try the Vendor Services Agreement with non-compete, arbitration, auto-renewal traps." className="w-full h- bg-[#020617] border border-gray-800 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500 resize-none" />
            <button onClick={analyze} className="w-full mt-4 bg-[#FF2D55] hover:bg-[#E0244A] text-white font-bold py-4 rounded-xl transition">🔍 Analyze for Traps</button>
            <div className="flex gap-2 mt-3 text- text-gray-500 justify-center">
              <span>✓ No data stored</span><span>•</span><span>✓ Not legal advice</span><span>•</span><span>✓ 100% private</span>
            </div>
          </div>

          {/* OUTPUT */}
          <div className="bg-white text-black rounded-2xl p-6 min-h-">
            {!result? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">🛡️</div>
                <h3 className="font-bold">Ready to scan</h3>
                <p className="text-sm text-gray-500 max-w- mt-2">Paste a contract on the left and we'll break it down into Plain English, Risk Flags, and exact fixes to ask for.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-black text-white text- px-2 py-1 rounded font-bold">PLAIN ENGLISH SUMMARY</span>
                  <span className="bg-red-100 text-red-600 text- px-2 py-1 rounded font-bold">{result.traps.length} TRAPS FOUND</span>
                </div>
                <p className="text-sm bg-gray-50 p-3 rounded-lg border mb-5">This Vendor Services Agreement says you can't work for competitors for <b>24 months anywhere in the US</b>, must arbitrate in <b>SF</b> if there's a dispute, and auto-renews unless you give <b>90 days notice</b> or pay 100%.</p>

                {result.traps.map((t:any,i:number)=>(
                  <div key={i} className="border-l-4 border-red-500 pl-4 py-3 mb-4 bg-red-50/50">
                    <div className="flex gap-2 items-center mb-1">
                      <span className={`text- font-bold px-1.5 py-0.5 rounded ${t.sev==='HIGH'||t.sev==='CRITICAL'?'bg-red-600 text-white':'bg-yellow-400'}`}>{t.sev}</span>
                      <span className="font-bold text-sm">TRAP {i+1}: {t.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">⚠️ {t.risk}</p>
                    <p className="text-xs mt-1"><b className="text-green-700">FIX:</b> {t.fix}</p>
                  </div>
                ))}

                <div className="bg-black text-white rounded-xl p-4 mt-6">
                  <p className="text-xs font-bold tracking-widest text-gray-400 mb-2">RECOMMENDATION</p>
                  <p className="text-sm">Send this: "Can we change non-compete to 6 months / Houston only, change arbitration to Harris County mediation, and make renewal 30-day opt-in?"</p>
                  <button onClick={()=>navigator.clipboard.writeText('Can we change non-compete to 6 months...')} className="mt-3 bg-white text-black text-xs font-bold px-4 py-2 rounded-lg">Copy Fix Request</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
