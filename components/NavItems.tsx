'use client'

import { NAV_ITEMS } from '@/lib/constant'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import SearchCommands from './SearchCommands'

const NavItems = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") return pathname === '/';

        if (path === "/search") {
            return pathname.startsWith("/stocks") || pathname.startsWith("/search");
        }

        return pathname.startsWith(path);
    }

    return (
        <ul className='flex flex-col sm:flex-row p-3 gap-3 sm:gap-10 font-medium'>
            {NAV_ITEMS.map(({ href, label }) => {
                if (href === '/search') return (
                    <li key="search-trigger" className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}>
                        <SearchCommands
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )

                return <li key={href}>
                    <Link href={href} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}>
                        {label}
                    </Link>
                </li>
            })}
        </ul>
    )
}

export default NavItems
