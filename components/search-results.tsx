"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { BibleChapterData } from "@/lib/bible-data"
import { bibleBooks, getBibleChapter } from "@/lib/bible-data"

interface SearchResultsProps {
  query: string
  onSelectPassage: (book: string, chapter: number, verse: number) => void
}

export default function SearchResults({ query, onSelectPassage }: SearchResultsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BibleChapterData[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Search through all books and chapters
    const searchResults: BibleChapterData[] = []
    
    for (const book of bibleBooks) {
      // Search through all chapters
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        const chapterData = getBibleChapter(book.name, chapter)
        if (!chapterData) continue

        // Search through all verses
        for (const verse of chapterData.verses) {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push({
              book_name: book.name,
              chapter: chapter,
              verses: [verse],
              reference: `${book.name} ${chapter}:${verse.verse}`
            })
            break // Stop after finding the first matching verse in this chapter
          }
        }
      }
    }

    setResults(searchResults)
    setIsLoading(false)
  }, [query])

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-4">Searching...</div>
      ) : results.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No results found for "{query}"
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {results.length} results found
          </div>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.reference}
                className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer"
                onClick={() => onSelectPassage(result.book_name, result.chapter, result.verses[0].verse)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{result.reference}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectPassage(result.book_name, result.chapter, result.verses[0].verse)
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {result.verses.map((verse) => (
                    <div key={verse.verse} className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground min-w-[30px]">
                        {verse.verse}.
                      </span>
                      <p className="text-lg leading-relaxed">{verse.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
