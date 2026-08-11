type FilterPanelProps = {
    query: string,
    onQueryChange: (value: string) => void
}

export function FilterPanel({ query, onQueryChange }: FilterPanelProps) {
    return (
        <div className="p-4">
            <input
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Fonlar içinde ara..."
                className="shadow-inner w-full rounded-full border border-gray-300 px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-green-900 hover:bg-gray-50"
            />
        </div>
    )
}
