type BrandLogoProps = {
    compact: boolean;
};

export function BrandLogo({ compact }: BrandLogoProps) {
    return (
        <div className="flex items-center justify-center gap-3">
            <img
                src="/logo.svg"
                alt="FonRadar AI Logo"
                className={compact ? "h-32" : "h-64"}
            />
            <h1
                className={`font-bold text-green-950 ${compact ? "text-5xl" : "text-7xl"}`}
            >
                FonRadar AI
            </h1>
        </div>
    );
}
