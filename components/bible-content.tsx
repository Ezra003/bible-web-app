"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Bookmark, Share2, Copy, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { getBibleChapter, BibleChapterData } from "@/lib/bible-data"

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

interface BibleContentProps {
  book: string
  chapter: number
  isLoading: boolean
  showOnlyVerse?: number
}

export default function BibleContent({ book, chapter, isLoading: parentLoading, showOnlyVerse }: BibleContentProps) {
  const [bibleContent, setBibleContent] = useState<BibleChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showFullChapter, setShowFullChapter] = useState(false)

  const [bookmarks, setBookmarks] = useLocalStorage<
    Array<{
      book: string
      chapter: number
      date: string
    }>
  >("bookmarks", [])

  const isBookmarked = bookmarks.some((b) => b.book === book && b.chapter === chapter)

  const loadChapter = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const chapterData = await getBibleChapter(book, chapter)
      if (!chapterData) {
        throw new Error("Chapter not found")
      }
      setBibleContent(chapterData)
    } catch (err) {
      console.error(err)
      setError("Failed to load Bible content. Please try again later.")
    } finally {
      setLoading(false)
      if (contentRef.current && showOnlyVerse !== undefined) {
        const verseElement = contentRef.current.querySelector(`[data-verse="${showOnlyVerse}"]`)
        if (verseElement) {
          // Prevent scroll jump by using setTimeout
          setTimeout(() => {
            verseElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 0)
        }
      }
    }
  }, [book, chapter, showOnlyVerse])

  useEffect(() => {
    loadChapter()
  }, [loadChapter])

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (contentRef.current) {
        const shouldShow = contentRef.current.scrollTop > 300
        if (shouldShow !== showScrollTop) {
          setShowScrollTop(shouldShow)
        }
      }
    }, 100)

    const currentRef = contentRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [showScrollTop])

  const toggleBookmark = () => {
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((b) => !(b.book === book && b.chapter === chapter))
      setBookmarks(updatedBookmarks)
      toast({
        description: "Bookmark removed",
      })
    } else {
      const newBookmark = { book, chapter, date: new Date().toISOString() }
      setBookmarks([...bookmarks, newBookmark])
      toast({
        description: "Bookmark added",
      })
    }
  }

  const sharePassage = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${book} ${chapter}`,
          text: bibleContent?.verses
            .map((verse) => `${verse.verse}. ${verse.text}`)
            .join("\n") || "",
        })
        .then(() => {
          toast({
            description: "Shared successfully",
          })
        })
        .catch((err) => {
          console.error("Error sharing:", err)
          toast({
            description: "Failed to share",
            variant: "destructive",
          })
        })
    } else {
      toast({
        description: "Sharing not supported on this device",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: "Copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err)
        toast({
          description: "Failed to copy",
          variant: "destructive",
        })
      })
  }

  const copyPassageText = () => {
    if (bibleContent) {
      const text = bibleContent.verses
        .map((verse) => `${verse.verse}. ${verse.text}`)
        .join("\n")
      copyToClipboard(text)
    }
  }

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const scrollToShowVerse = useCallback(() => {
    if (contentRef.current && showOnlyVerse !== undefined) {
      const verseElement = contentRef.current.querySelector(`[data-verse="${showOnlyVerse}"]`)
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [showOnlyVerse])

  useEffect(() => {
    if (showFullChapter && showOnlyVerse !== undefined) {
      scrollToShowVerse()
    }
  }, [showFullChapter, scrollToShowVerse])

  if (parentLoading || loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-muted/50 rounded animate-pulse" />
        <div className="h-6 w-48 bg-muted/50 rounded animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive">
        <p>{error}</p>
        <Button onClick={loadChapter} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (!bibleContent) {
    return <div className="text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className="h-4 w-4 mr-1" />
            {isBookmarked ? "Remove" : "Add"} Bookmark
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={sharePassage}
            aria-label="Share passage"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyPassageText}
            aria-label="Copy passage"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>

      <div className="space-y-4" ref={contentRef}>
        {showOnlyVerse !== undefined && !showFullChapter ? (
          <div className="flex items-start gap-2">
            <span className="text-sm text-muted-foreground min-w-[30px]">
              {showOnlyVerse}.
            </span>
            <p className="text-lg leading-relaxed">
              {bibleContent.verses.find((v) => v.verse === showOnlyVerse)?.text || ""}
            </p>
          </div>
        ) : (
          bibleContent.verses.map((verse) => (
            <div
              key={verse.verse}
              className={`flex items-start gap-2 ${
                verse.verse === showOnlyVerse ? "bg-accent/50" : "hover:bg-accent/10 transition-colors"
              }`}
              data-verse={verse.verse}
            >
              <span className="text-sm text-muted-foreground min-w-[30px]">
                {verse.verse}.
              </span>
              <p className="text-lg leading-relaxed">{verse.text}</p>
            </div>
          ))
        )}
      </div>

      {showOnlyVerse !== undefined && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setShowFullChapter(!showFullChapter)}
        >
          {showFullChapter ? "Show Only Verse" : "Show Full Chapter"}
        </Button>
      )}

      {showScrollTop && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-4 right-4"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4 mr-2" />
          Top
        </Button>
      )}
    </div>
  )
}
