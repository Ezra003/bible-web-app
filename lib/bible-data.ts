import kjvData from "@/data/KJV.json"

interface BibleVerse {
  verse: number
  text: string
}

interface BibleChapter {
  chapter: number
  verses: BibleVerse[]
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
  verses: BibleVerse[]
  reference: string
}

// Type assertion for the KJV data
const typedKJVData = kjvData as {
  books: BibleBookData[]
}

// Function to determine testament based on book position
const getTestament = (bookName: string, bookIndex: number): "old" | "new" => {
  // Matthew is the first New Testament book
  if (bookIndex >= typedKJVData.books.findIndex((book) => book.name === "Matthew")) return "new"
  
  // All books before Matthew are Old Testament
  return "old"
}

export const bibleBooks: BibleBook[] = typedKJVData.books.map((book: BibleBookData, index: number) => ({
  name: book.name,
  chapters: book.chapters.length,
  testament: getTestament(book.name, index)
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
  
  const verseData = chapterData.verses.find((v: BibleVerse) => v.verse === verse)
  return verseData ? verseData.text : ""
}
