'use client'

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "./ui/command";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import useDebounce from "@/app/hooks/useDebounce";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";


const SearchCommands = ({ renderAs = 'button', label = 'Add stock', initialStocks }) => {

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState(initialStocks);

    const isSearchMode = !!searchTerm.trim()
    const displayStocks = isSearchMode ? stocks : stocks.slice(0, 5);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen(true)
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown)

    }, [])

    const handleSearch = async () => {
        if (!isSearchMode) return setStocks(initialStocks);

        setLoading(true);

        try {
            const result = await searchStocks(searchTerm.trim());
            setStocks(result)
        } catch (error) {
            setStocks([])
        } finally {
            setLoading(false)
        }
    }

    const debounceSearch = useDebounce(handleSearch, 300)

    useEffect(() => {
        debounceSearch();
    }, [searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("")
        setStocks(initialStocks)
    }


    return (
        <>
            {renderAs === 'text' ? (
                <span onClick={() => setOpen(true)} className="search-btn">
                    {label}
                </span>
            ) : (
                <button onClick={() => setOpen(true)} className="search-btn">
                    {label}
                </button>
            )}

            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field">
                    <CommandInput placeholder="Search stocks.." value={searchTerm} onValueChange={setSearchTerm} className="search-input" />
                    {loading && <Loader2 className="search-loader" />}
                </div>
                <CommandList className="search-list">
                    {loading ? (
                        <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
                    ) : (
                        <ul>
                            <div className="search-count">
                                {isSearchMode ? 'Search results' : 'Popular stocks'}
                                {` `}({displayStocks?.length || 0})
                            </div>
                            {displayStocks?.map((stock, i) => (
                                <li key={stock.symbol} className="search-item">
                                    <Link
                                        href={`/stocks/${stock.symbol}`}
                                        onClick={handleSelectStock}
                                        className="search-item-link"
                                    >
                                        <TrendingUp className="h-4 w-4 text-gray-500" />
                                        <div className="flex-1">
                                            <div className="search-item-name">
                                                {stock.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {stock.symbol} | {stock.exchange} | {stock.type}
                                            </div>
                                        </div>
                                        {/*<Star />*/}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default SearchCommands
