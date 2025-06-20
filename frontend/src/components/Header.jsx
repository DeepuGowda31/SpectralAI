import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button"
import { ModeToggle } from './ui/mode-toggle';
import { Activity, FileText, Home, LogOut } from 'lucide-react';
import { SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 backdrop:blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-blue-600">
          <Activity className="h-6 w-6 text-blue-600" />
          <span>Spectral AI</span>
        </Link>
        
        {/* <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link to="/upload" className="text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Analysis
          </Link>
        </nav> */}
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <Button asChild variant="outline" size="sm" className="hidden md:flex">
              <Link to="/upload">Start Diagnosis</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              <Link to="/upload">Upload Image</Link>
            </Button>
            <SignOutButton>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Button asChild variant="outline" size="sm">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;