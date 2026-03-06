// modules/chatbot/components/ChatbotSuggestions.tsx
// Chips de preguntas rápidas contextuales — sugerencias del último mensaje del bot.

interface ChatbotSuggestionsProps {
  suggestions: string[]
  onSelect:    (suggestion: string) => void
  disabled?:   boolean
}

export default function ChatbotSuggestions({ suggestions, onSelect, disabled }: ChatbotSuggestionsProps) {
  if (!suggestions.length) return null

  return (
    <div className="cb-quick-replies">
      {suggestions.map(s => (
        <button
          key={s}
          className="cb-quick-btn"
          onClick={() => onSelect(s)}
          disabled={disabled}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
