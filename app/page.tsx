import BibleReader from "@/components/bible-reader"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <BibleReader />
      </main>
    </div>
  )
}

