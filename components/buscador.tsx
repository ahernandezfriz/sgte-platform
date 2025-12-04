'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react" // Ícono de lupa

interface Props {
  valor: string
  onChange: (val: string) => void
  placeholder?: string
}

export function Buscador({ valor, onChange, placeholder = "Buscar..." }: Props) {
  return (
    <div className="relative w-full md:w-[300px]">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
      <Input
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 bg-white"
      />
    </div>
  )
}