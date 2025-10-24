'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition"
      title={copied ? "Copié !" : "Copier"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 text-slate-300" />
      )}
    </button>
  )
}

