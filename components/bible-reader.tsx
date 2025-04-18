"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import BibleContent from "./bible-content"
import BibleNavigation from "./bible-navigation"
import SearchResults from "./search-results"
import Bookmarks from "./bookmarks"
import ReadingHistory from "./reading-history"
import ThemeToggle from "./theme-toggle"
import { bibleBooks } from "@/lib/bible-data"
import { useLocalStorage } from "@/hooks/use-local-storage"
import {
  BookOpen,
  BookMarked,
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"

export default function BibleReader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("read")
  const [searchQuery, setSearchQuery] = useState("")

  // Get current book, chapter from URL or set defaults
  const book = searchParams.get("book") || "Genesis"
  const chapter = Number.parseInt(searchParams.get("chapter") || "1")

  // Use custom hook for reading history
  const [readingHistory, setReadingHistory] = useLocalStorage<
    Array<{
      book: string
      chapter: number
      date: string
    }>
  >("readingHistory", [])

  // Navigate to a specific book and chapter
  const navigateTo = useCallback((newBook: string, newChapter: number, verse?: number) => {
    // Update URL
    router.push(`/?book=${encodeURIComponent(newBook)}&chapter=${newChapter}${verse ? `&verse=${verse}` : ''}`)

    // Add to reading history
    const newEntry = { book: newBook, chapter: newChapter, date: new Date().toISOString() }

    // Avoid duplicates and keep only the last 20 entries
    const filteredHistory = readingHistory
      .filter((entry) => !(entry.book === newBook && entry.chapter === newChapter))
      .slice(0, 19)

    setReadingHistory([newEntry, ...filteredHistory])

    // Reset to read tab when navigating
    setActiveTab("read")
  }, [readingHistory, setReadingHistory, setActiveTab, router])

  // Handle navigation to previous chapter
  const goToPreviousChapter = () => {
    const currentBookIndex = bibleBooks.findIndex((b) => b.name === book)

    if (chapter > 1) {
      // Go to previous chapter in the same book
      navigateTo(book, chapter - 1)
    } else if (currentBookIndex > 0) {
      // Go to the last chapter of the previous book
      const previousBook = bibleBooks[currentBookIndex - 1]
      navigateTo(previousBook.name, previousBook.chapters)
    }
  }

  // Handle navigation to next chapter
  const goToNextChapter = () => {
    const currentBookIndex = bibleBooks.findIndex((b) => b.name === book)

    if (chapter < bibleBooks[currentBookIndex].chapters) {
      // Go to next chapter in the same book
      navigateTo(book, chapter + 1)
    } else if (currentBookIndex < bibleBooks.length - 1) {
      // Go to the first chapter of the next book
      const nextBook = bibleBooks[currentBookIndex + 1]
      navigateTo(nextBook.name, 1)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setActiveTab("search")
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when in read tab
      if (activeTab !== "read") return

      if (e.key === "ArrowLeft") {
        goToPreviousChapter()
      } else if (e.key === "ArrowRight") {
        goToNextChapter()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeTab])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bible Reader</h1>
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="hidden md:block border rounded-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
          <BibleNavigation onSelectPassage={navigateTo} currentBook={book} currentChapter={chapter} />
        </div>

        <div className="border rounded-lg p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="read" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> Read
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-1">
                  <Search className="h-4 w-4" /> Search
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-1">
                  <BookMarked className="h-4 w-4" /> Bookmarks
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <History className="h-4 w-4" /> History
                </TabsTrigger>
              </TabsList>
            </div>

            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search the Bible..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!searchQuery.trim()}>
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </form>

            <div className="min-h-[60vh]">
              <TabsContent value="read" className="mt-0 h-full">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10">
                  <h2 className="text-xl font-semibold">
                    {book} {chapter}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousChapter}
                      disabled={book === "Genesis" && chapter === 1}
                      aria-label="Previous chapter"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextChapter}
                      disabled={book === "Revelation" && chapter === 22}
                      aria-label="Next chapter"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                <BibleContent 
                  book={book} 
                  chapter={chapter} 
                  isLoading={isLoading} 
                  showOnlyVerse={Number(searchParams.get("verse")) || undefined}
                />
              </TabsContent>

              <TabsContent value="search" className="mt-0">
                <SearchResults query={searchQuery} onSelectPassage={(book, chapter, verse) => {
                  navigateTo(book, chapter, verse)
                  setActiveTab("read")
                }} />
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-0">
                <Bookmarks onSelectPassage={navigateTo} />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <ReadingHistory
                  history={readingHistory}
                  onSelectPassage={navigateTo}
                  onClearHistory={() => setReadingHistory([])}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
