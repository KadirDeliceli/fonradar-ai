type QueryPanelProps = {
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
};

export function QueryPanel({
    query,
    onQueryChange,
    onSearch,
}: QueryPanelProps) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSearch();
            }}
            className="flex gap-3 rounded-full border border-gray-200 bg-white p-4"
        >
            <img
                src="/radar_icon.svg"
                alt="FonRadar AI ikonu"
                className="w-15 h-15 rounded-full"
            />
            <input
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Fonlar içinde ara..."
                className="flex-1 rounded-full px-3 py-2 text-xl outline-none"
            />
            {query !== "" && (
                <button
                    type="button"
                    onClick={() => onQueryChange("")}
                    aria-label="Aramayı Temizle"
                    className="rounded-full text-gray-600 px-6 py-3 hover:text-gray-600"
                >
                    X
                </button>
            )}
            <button
                type="submit"
                className="rounded-full bg-green-950 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
            >
                Ara
            </button>
        </form>
    );
}
