import kjvData from "@/data/KJV.json"

interface BibleChapter {
  chapter: number
  verses: Array<{
    verse: number
    text: string
  }>
}

interface BibleBookData {
  name: string
  chapters: BibleChapter[]
}

interface BibleBook {
  name: string
  chapters: number
  testament: "old" | "new"
}

export interface BibleChapterData {
  book_name: string
  chapter: number
  verses: Array<{
    verse: number
    text: string
  }>
  reference: string
}

// Type assertion for the KJV data
const typedKJVData = kjvData as {
  books: BibleBookData[]
}

export const bibleBooks: BibleBook[] = typedKJVData.books.map((book: BibleBookData) => ({
  name: book.name,
  chapters: book.chapters.length,
  testament: book.name === "Genesis" ? "old" : book.name === "Revelation" ? "new" : book.name === "Matthew" ? "new" : "old"
}))

export const getBibleChapter = (book: string, chapter: number): BibleChapterData | null => {
  const bookData = typedKJVData.books.find((b: BibleBookData) => b.name === book)
  if (!bookData) return null
  
  const chapterData = bookData.chapters.find((c: BibleChapter) => c.chapter === chapter)
  if (!chapterData) return null

  return {
    book_name: book,
    chapter: chapter,
    verses: chapterData.verses,
    reference: `${book} ${chapter}`
  }
}

export const getVerseText = (book: string, chapter: number, verse: number): string => {
  const chapterData = getBibleChapter(book, chapter)
  if (!chapterData) return ""
  
  const verseData = chapterData.verses.find((v: { verse: number; text: string }) => v.verse === verse)
  return verseData ? verseData.text : ""
}
