'use client'

import { useEffect, useState } from "react"
import { CommandDialog, CommandInput, CommandList } from "./ui/command";


const SearchCommands = ({ initialStocks = [] }) => {

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const [stocks, setStocks] = useState(initialStocks);

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

    const isSearchMode = !!searchTerm.trim()
    const displayStocks = isSearchMode ? stocks : stocks.slice(0, 5);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("")
        setStocks(initialStocks)
    }


    return (
        <>
            <button onClick={() => setOpen(true)} className="search-btn">
                Search Stocks
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search stocks.." value={searchTerm} onValueChange={setSearchTerm} />
                <CommandList>
                    <div className="p-4">
                        <div className="text-sm text-gray-500 mb-2">
                            {isSearchMode ? 'Search Results' : 'Popular Stocks'}
                            ({displayStocks.length})
                        </div>

                        {displayStocks.length === 0 ? (
                            <p>{isSearchMode ? 'No results found' : 'No stocks available'}</p>
                        ) : (
                            <ul className="space-y-2">
                                {displayStocks.map((stock) => (
                                    <li key={stock.symbol} className="p-2 border rounded">
                                        <div className="font-medium">{stock.name}</div>
                                        <div className="text-sm text-gray-500">{stock.symbol}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default SearchCommands
