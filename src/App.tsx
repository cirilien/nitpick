import { useState } from 'react'
import { Editor } from './components/Editor'
import { ResultsPanel } from './components/ResultsPanel'

function App() {
  const [text, setText] = useState('')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">NitPick</h1>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-1 min-h-[300px] md:min-h-0">
          <Editor text={text} onChange={setText} />
        </div>
        <div className="flex-1 min-h-[200px] md:min-h-0">
          <ResultsPanel text={text} />
        </div>
      </main>
    </div>
  )
}

export default App
