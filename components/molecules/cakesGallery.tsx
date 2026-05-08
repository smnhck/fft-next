"use client"

import { useMemo, useState } from 'react'
import CakeCard from './cakeCard'

export default function CakesGallery({ cakes, showCategoryFilter = true }: { cakes: any[]; showCategoryFilter?: boolean }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const categories = useMemo(() => {
    const s = new Set<string>()
    cakes?.forEach((c: any) => c.categoriesCollection?.items?.forEach((it: any) => s.add(it.title)))
    return Array.from(s)
  }, [cakes])

  const filtered = useMemo(() => {
    return cakes.filter((c: any) => {
      const matchesQuery = query.trim() === '' || c.title?.toLowerCase().includes(query.toLowerCase()) || c.teaser?.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || c.categoriesCollection?.items?.some((it: any) => it.title === category)
      return matchesQuery && matchesCategory
    })
  }, [cakes, query, category])

  return (
    <div>
      <div className="backdrop-blur-sm bg-white/60 rounded-lg p-3 flex gap-3 items-center mb-6">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Suche" className="flex-1 p-2 rounded border" />
        {showCategoryFilter && (
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 rounded border hidden sm:block">
            <option value="">Alle Kategorien</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <button onClick={() => { setQuery(''); setCategory('') }} className="bg-primary text-white px-4 py-2 rounded">Zurücksetzen</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((cake: any) => (
          <CakeCard key={cake.sys?.id || cake.slug} cake={cake} />
        ))}
      </div>
    </div>
  )
}
