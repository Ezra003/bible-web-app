"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Trash2, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReadingHistoryProps {
  history: Array<{
    book: string
    chapter: number
    date: string
  }>
  onSelectPassage: (book: string, chapter: number) => void
  onClearHistory: () => void
}

export default function ReadingHistory({ history, onSelectPassage, onClearHistory }: ReadingHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p>Your reading history is empty.</p>
        <p className="text-sm text-muted-foreground mt-2">Passages you read will appear here.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reading History</h2>
        <Button variant="outline" size="sm" onClick={onClearHistory} aria-label="Clear reading history">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <div className="space-y-2">
        {history.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors"
          >
            <div>
              <h3 className="font-medium">
                {entry.book} {entry.chapter}
              </h3>
              <p className="text-xs text-muted-foreground">Read {formatDistanceToNow(new Date(entry.date))} ago</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectPassage(entry.book, entry.chapter)}
              aria-label={`Open ${entry.book} ${entry.chapter}`}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Open
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

