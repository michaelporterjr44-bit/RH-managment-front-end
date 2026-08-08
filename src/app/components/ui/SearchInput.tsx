"use client";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Rechercher...",
}) => {
    return (
        <div className="relative w-full max-w-sm">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-green-600 focus:border-transparent
        outline-none text-sm"
            />
        </div>
    );
};

export default SearchInput;