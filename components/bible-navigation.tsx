"use client"

import React from "react"

import { useState, useMemo, useCallback } from "react"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { bibleBooks } from "@/lib/bible-data"

interface BibleNavigationProps {
  onSelectPassage: (book: string, chapter: number) => void
  currentBook: string
  currentChapter: number
}

export default function BibleNavigation({ onSelectPassage, currentBook, currentChapter }: BibleNavigationProps) {
  const [openBooks, setOpenBooks] = useState<Record<string, boolean>>({
    [currentBook]: true,
  })
  const [searchTerm, setSearchTerm] = useState("")

  const toggleBook = useCallback((book: string) => {
    setOpenBooks((prev) => ({
      ...prev,
      [book]: !prev[book],
    }))
  }, [])

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return bibleBooks

    return bibleBooks.filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm])

  // Group books by testament
  const oldTestamentBooks = useMemo(() => filteredBooks.filter((book) => book.testament === "old"), [filteredBooks])

  const newTestamentBooks = useMemo(() => filteredBooks.filter((book) => book.testament === "new"), [filteredBooks])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Find a book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-1">
          {filteredBooks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No books found</p>
          ) : (
            <>
              {oldTestamentBooks.length > 0 && (
                <>
                  <h2 className="font-semibold mb-2">Old Testament</h2>
                  {oldTestamentBooks.map((book) => (
                    <BookItem
                      key={book.name}
                      book={book}
                      isOpen={!!openBooks[book.name]}
                      toggleBook={toggleBook}
                      onSelectPassage={onSelectPassage}
                      currentBook={currentBook}
                      currentChapter={currentChapter}
                    />
                  ))}
                </>
              )}

              {newTestamentBooks.length > 0 && (
                <>
                  <h2 className="font-semibold mb-2 mt-4">New Testament</h2>
                  {newTestamentBooks.map((book) => (
                    <BookItem
                      key={book.name}
                      book={book}
                      isOpen={!!openBooks[book.name]}
                      toggleBook={toggleBook}
                      onSelectPassage={onSelectPassage}
                      currentBook={currentBook}
                      currentChapter={currentChapter}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Extracted BookItem component for better organization
interface BookItemProps {
  book: { name: string; chapters: number }
  isOpen: boolean
  toggleBook: (book: string) => void
  onSelectPassage: (book: string, chapter: number) => void
  currentBook: string
  currentChapter: number
}

const BookItem = React.memo(function BookItem({
  book,
  isOpen,
  toggleBook,
  onSelectPassage,
  currentBook,
  currentChapter,
}: BookItemProps) {
  // Memoize the chapter buttons to prevent unnecessary re-renders
  const chapterButtons = useMemo(() => {
    return Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => (
      <Button
        key={chapter}
        variant={book.name === currentBook && chapter === currentChapter ? "default" : "outline"}
        size="sm"
        className="h-8 w-8"
        onClick={() => onSelectPassage(book.name, chapter)}
      >
        {chapter}
      </Button>
    ))
  }, [book.chapters, book.name, currentBook, currentChapter, onSelectPassage])

  return (
    <Collapsible key={book.name} open={isOpen} onOpenChange={() => toggleBook(book.name)} className="mb-1">
      <CollapsibleTrigger asChild>
        <Button
          variant={book.name === currentBook ? "secondary" : "ghost"}
          className="w-full justify-between font-normal"
        >
          {book.name}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-5 gap-1 p-1">{chapterButtons}</div>
      </CollapsibleContent>
    </Collapsible>
  )
})

