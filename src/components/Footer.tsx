
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background/80 text-muted-foreground font-body border-t border-border/50">
      <div className="container py-4 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex-shrink-0">
                <Link href="/" className="inline-block">
                <div className="text-left">
                    <span className="font-bold font-headline text-base block leading-none text-foreground">Zwivhuyaex CV</span>
                </div>
                </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Zwivhuyaex CV. All rights reserved.</p>
            </div>
             <div className="flex gap-4 text-xs">
                <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
