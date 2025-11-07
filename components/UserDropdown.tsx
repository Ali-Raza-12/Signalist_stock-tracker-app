'use client'


import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NavItems from './NavItems'
import { LogOut } from 'lucide-react'
import { signOut } from '@/lib/actions/auth.action'

const UserDropdown = ({ user }: {user: User}) => {

    const router = useRouter();

    const handleSignout = async () => {
        await signOut();
        router.push("/sign-in")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='hidden md:flex flex-col items-start'>
                        <span className='text-base font-medium text-gray-400'>
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='text-gray-400'>
                <div className='flex items-center gap-3 py-3'>
                    <DropdownMenuLabel className='flex gap-4 items-center'>
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span className='text-base font-medium text-gray-400'>
                                {user.name}
                            </span>
                            <span className='text-sm text-gray-500'>{user.email}</span>
                        </div>
                    </DropdownMenuLabel>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignout} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer'>
                    <LogOut className ="w-4 h-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>

                <DropdownMenuSeparator className='hidden sm:block bg-gray-600' />

                <nav className='sm:hidden'>
                    <NavItems />
                </nav>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
