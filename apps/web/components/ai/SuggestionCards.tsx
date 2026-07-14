"use client";

interface SuggestionCardsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export default function SuggestionCards({
  suggestions,
  onSelect,
}: SuggestionCardsProps) {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="rounded-xl border border-gray-200 bg-white p-4 text-left text-sm shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}