"use client"
import { useState } from "react"
export default function Page(){
 const [input,setInput]=useState("")
 const [output,setOutput]=useState("")
 const [loading,setLoading]=useState(false)
 const examples={
  Contracts:"Non-compete 24 months within 100 miles, Delaware arbitration, auto-renewal 60 days notice required, penalty $5000.",
  Privacy:"We collect and share location, browsing history with third parties. User waives opt-out rights.",
  Leases:"Valet trash $35/mo, pet rent $200/mo, landlord may enter without notice, 12 month lease."
 }
 const analyze=async()=>{
  if(!input.trim()) return
  setLoading(true)
  try{
   const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:input})})
   const d=await r.json()
   setOutput(d.result)
  }catch{setOutput("Demo: Connect Ollama in /api/analyze/route.ts")}
  setLoading(false)
 }
 return(
  <main style={{minHeight:"100vh",background:"#0B1026",color:"white",padding:"40px 24px"}}>
   <div style={{maxWidth:"1100px",margin:"0 auto"}}>
    <h1 style={{fontSize:"42px",fontWeight:900,textAlign:"center",letterSpacing:"4px"}}>CLAUSE SHIELD</h1>
    <p style={{textAlign:"center",opacity:.7,marginTop:"8px"}}>Your Legal A.I. Solution</p>
    <p style={{textAlign:"center",color:"#FF6B6B",marginTop:"36px",fontWeight:700,letterSpacing:"1px"}}>Common Document Types</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginTop:"16px",maxWidth:"700px",marginInline:"auto"}}>
     {Object.entries(examples).map(([k,v])=>(
      <button key={k} onClick={()=>setInput(v)} style={{background:"#151B36",border:"2px solid #2A3055",borderRadius:"16px",padding:"36px",fontWeight:900,color:"white",cursor:"pointer"}}>{k}</button>
     ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginTop:"32px"}}>
     <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste agreement here..." style={{width:"100%",height:"380px",background:"#7A9CC6",color:"black",padding:"24px",borderRadius:"20px",border:"none",fontSize:"18px"}}></textarea>
      <button onClick={analyze} style={{width:"100%",background:"#FF4D4D",padding:"18px",borderRadius:"14px",fontWeight:900,fontSize:"18px",border:"none",cursor:"pointer"}}>{loading?"ANALYZING...":"Analyze Document"}</button>
     </div>
     <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <div style={{width:"100%",height:"380px",background:"#7A9CC6",color:"#8B0000",padding:"24px",borderRadius:"20px",overflow:"auto",whiteSpace:"pre-wrap",fontWeight:700,fontSize:"18px"}}>{output||"your summary will apear here"}</div>
      <button onClick={()=>navigator.clipboard.writeText(output)} style={{width:"100%",background:"#FF6B00",padding:"18px",borderRadius:"14px",fontWeight:900,fontSize:"18px",border:"none",cursor:"pointer"}}>Copy</button>
     </div>
    </div>
    <p style={{textAlign:"center",fontSize:"12px",opacity:.4,marginTop:"48px"}}>For informational purposes only, not legal advice. Private, local AI processing.</p>
   </div>
  </main>
 )
}
