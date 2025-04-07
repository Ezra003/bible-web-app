"use client"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, BookMarked } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface BookmarksProps {
  onSelectPassage: (book: string, chapter: number) => void
}

interface Bookmark {
  book: string
  chapter: number
  date: string
}

export default function Bookmarks({ onSelectPassage }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("bookmarks", [])
  const { toast } = useToast()

  const removeBookmark = (book: string, chapter: number) => {
    const updatedBookmarks = bookmarks.filter((b) => !(b.book === book && b.chapter === chapter))

    setBookmarks(updatedBookmarks)

    toast({
      description: "Bookmark removed",
    })
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p>You haven't bookmarked any passages yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          While reading, click the bookmark button to save passages for later.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Bookmarks</h2>

      <div className="space-y-2">
        {bookmarks.map((bookmark, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors"
          >
            <div>
              <h3 className="font-medium">
                {bookmark.book} {bookmark.chapter}
              </h3>
              <p className="text-xs text-muted-foreground">Saved {formatDistanceToNow(new Date(bookmark.date))} ago</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectPassage(bookmark.book, bookmark.chapter)}
                aria-label={`Open ${bookmark.book} ${bookmark.chapter}`}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBookmark(bookmark.book, bookmark.chapter)}
                aria-label="Remove bookmark"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

