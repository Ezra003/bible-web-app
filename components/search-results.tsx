"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen } from "lucide-react"

interface SearchResultsProps {
  query: string
  onSelectPassage: (book: string, chapter: number) => void
}

interface SearchResult {
  book: string
  chapter: number
  verse: number
  text: string
}

export default function SearchResults({ query, onSelectPassage }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchBible = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // In a real app, we would use a proper Bible search API
        // For this demo, we'll create a more realistic search simulation
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Generate more realistic search results based on the query
        const searchTerm = query.toLowerCase()
        const mockResults: SearchResult[] = []

        // Create a more diverse set of results based on the query
        if (searchTerm.includes("love")) {
          mockResults.push(
            {
              book: "John",
              chapter: 3,
              verse: 16,
              text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
            },
            {
              book: "1 Corinthians",
              chapter: 13,
              verse: 4,
              text: "Love is patient and kind; love does not envy or boast; it is not arrogant",
            },
            {
              book: "1 John",
              chapter: 4,
              verse: 8,
              text: "Anyone who does not love does not know God, because God is love.",
            },
          )
        } else if (searchTerm.includes("faith")) {
          mockResults.push(
            {
              book: "Hebrews",
              chapter: 11,
              verse: 1,
              text: "Now faith is the assurance of things hoped for, the conviction of things not seen.",
            },
            {
              book: "Romans",
              chapter: 10,
              verse: 17,
              text: "So faith comes from hearing, and hearing through the word of Christ.",
            },
            {
              book: "James",
              chapter: 2,
              verse: 17,
              text: "So also faith by itself, if it does not have works, is dead.",
            },
          )
        } else if (searchTerm.includes("peace")) {
          mockResults.push(
            {
              book: "Philippians",
              chapter: 4,
              verse: 7,
              text: "And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
            },
            {
              book: "John",
              chapter: 14,
              verse: 27,
              text: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.",
            },
          )
        } else {
          // Default results for any other search
          mockResults.push(
            { book: "Psalm", chapter: 23, verse: 1, text: "The Lord is my shepherd; I shall not want." },
            {
              book: "Proverbs",
              chapter: 3,
              verse: 5,
              text: "Trust in the Lord with all your heart, and do not lean on your own understanding.",
            },
            {
              book: "Romans",
              chapter: 8,
              verse: 28,
              text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
            },
            { book: "Philippians", chapter: 4, verse: 13, text: "I can do all things through him who strengthens me." },
          )
        }

        setResults(mockResults)
      } catch (err) {
        console.error(err)
        setError("Failed to search. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    searchBible()
  }, [query])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (results.length === 0 && query.trim()) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p>No results found for "{query}"</p>
        <p className="text-sm text-muted-foreground mt-2">Try using different keywords or check your spelling</p>
      </div>
    )
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p>Enter a search term to find verses</p>
        <p className="text-sm text-muted-foreground mt-2">Try searching for words like "love", "faith", or "peace"</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>

      {results.map((result, index) => (
        <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">
              {result.book} {result.chapter}:{result.verse}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectPassage(result.book, result.chapter)}
              aria-label={`Open ${result.book} ${result.chapter}`}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Open
            </Button>
          </div>
          <p>{result.text}</p>
        </div>
      ))}
    </div>
  )
}

