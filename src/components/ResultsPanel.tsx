interface ResultsPanelProps {
  text: string
}

export function ResultsPanel({ text: _text }: ResultsPanelProps) {
  return (
    <div className="h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-center">
      <p className="text-gray-400 text-center">
        Paste or type some text to get started.
      </p>
    </div>
  )
}
