'use client';
import { Calendar, Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggel';
import { usePathname } from 'next/navigation';
import { docsConfig } from '@/configs/docs';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary h-5 w-5" />
          <span className="font-inter text-xl font-semibold tracking-tight">
            React Event Calendar
          </span>
        </div>
        <nav className="hidden md:flex md:items-center md:gap-6">
          {docsConfig.mainNav.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${pathname === item.href ? 'text-primary' : ''} hover:text-primary text-sm font-medium transition-colors`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com/fahrezapratamahidayat/react-event-calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github size={16} />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
