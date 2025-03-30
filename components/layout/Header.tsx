import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    return (
        <header className="border-b px-5">
            <div className="container mx-auto flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl">
                        Smart Insurance
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link href="/applications" className="text-sm font-medium transition-colors hover:text-primary">
                            My Applications
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button variant="outline" size="sm">
                        Sign In
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;