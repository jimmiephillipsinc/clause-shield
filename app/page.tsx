'use client'
import { useState } from 'react'

export default function Home() {
  const [contract, setContract] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    const text = contract.toLowerCase()
    const traps = []

    // 1. Non-compete
    const ncMatch = contract.match(/(\d+)\s*months?.*non-compete|non-compete.*(\d+)\s*months?/i) || text.match(/(\d+)-month/)
    const months = ncMatch? parseInt(ncMatch[1] || ncMatch[2] || '24') : 0
    if (text.includes('non-compete') || text.includes('non compete')) {
      const miles = contract.match(/(\d+)\s*miles?/i)
      const distance = miles? miles[1] : 'United States'
      traps.push({
        title: `Non-compete ${months || 24} months / ${distance} is overbroad`,
        severity: months >= 12? 'HIGH' : 'MEDIUM',
        fix: 'Ask for 6-12 months, 25 miles or city-only, and Texas if you are in Texas.'
      })
    }

    // 2. Arbitration / Venue
    if (text.includes('arbitration')) {
      const arbLoc = contract.match(/arbitration in ([A-Za-z,]+)[,.]/i)
      const loc = arbLoc? arbLoc[1] : 'out-of-state'
      traps.push({
        title: `Forced arbitration in ${loc} = expensive to dispute`,
        severity: 'MEDIUM',
        fix: 'Ask for mediation first, venue in your home county, and split costs.'
      })
    }

    // 3. Auto-renewal
    if (text.includes('automatically renew') || text.includes('auto-renew')) {
      const days = contract.match(/(\d+)\s*days.*notice/i)
      const notice = days? days[1] : '90'
      traps.push({
        title: `Auto-renewal with ${notice}-day notice traps you`,
        severity: 'MEDIUM',
        fix: 'Ask for 30-day notice and email reminder before renewal.'
      })
    }

    // 4. Indemnification
    if (text.includes('indemnify') && text.includes('hold harmless')) {
      traps.push({
        title: 'One-sided unlimited indemnification',
        severity: 'HIGH',
        fix: 'Make it mutual and cap at amount paid under contract.'
      })
    }

    // 5. Termination fee
    if (text.includes('termination fee') && text.match(/100%/)) {
      traps.push({
        title: '100% termination fee = you pay full contract if you leave early',
        severity: 'HIGH',
        fix: 'Ask for no fee with 30-day notice, or pro-rated fee only.'
      })
    }

    setResult({
      plain: contract.slice(0, 250) + '... This means you are agreeing to ' + (traps.length? traps[0].title.toLowerCase() : 'risky terms') + '.',
      traps,
      recommendation: traps.length? 'Ask to amend: ' + traps.map(t=>t.fix).slice(0,2).join(' ') : 'Looks clean.'
    })
  }

  return (
    <main style={{maxWidth:800, margin:'40px auto', padding:20, fontFamily:'sans-serif', background:'#0f172a', color:'white', minHeight:'100vh'}}>
      <h1>CLAUSE SHIELD</h1>
      <p>Your Legal AI - Paste any contract below</p>
      <textarea value={contract} onChange={e=>setContract(e.target.value)} placeholder="Paste contract here..." style={{width:'100%', height:200, padding:12}} />
      <button onClick={analyze} style={{marginTop:12, padding:'10px 20px', background:'#f43f5e', color:'white', border:'none', cursor:'pointer'}}>Analyze for Traps</button>

      {result && (
        <div style={{marginTop:20, background:'white', color:'black', padding:20, borderRadius:8}}>
          <h3>PLAIN ENGLISH:</h3><p>{result.plain}</p>
          {result.traps.map((t:any,i:number)=>(
            <div key={i} style={{borderLeft:'4px solid red', paddingLeft:10, margin:'10px 0'}}>
              🚩 TRAP {i+1} [{t.severity}]: {t.title}<br/>
              <small>FIX: {t.fix}</small>
            </div>
          ))}
          <p><b>RECOMMENDATION:</b> {result.recommendation}</p>
          <p><b>NEXT STEP:</b> Copy this and ask landlord/employer to amend.</p>
        </div>
      )}
    </main>
  )
}
