
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2, Files, MoreVertical, Edit, Download, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton';

// Mock resume data structure
type Resume = {
  id: string;
  title: string;
  updatedAt: Date;
  previewUrl?: string; // URL to a small image preview of the resume
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // TODO: Fetch resumes from Firestore here
        // For now, we'll use an empty array
        setResumes([]); 
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-muted/20">
          <div className="container py-8 md:py-12">
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                  <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                  <CardFooter><Skeleton className="h-8 w-full" /></CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return null; // Should be redirected, but this is a fallback.
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</h1>
                  <p className="text-muted-foreground mt-1">Manage your resumes and create new ones.</p>
              </div>
              <Button asChild>
                  <Link href="/dashboard">
                      <FilePlus2 className="mr-2" /> Create New Resume
                  </Link>
              </Button>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg bg-background">
                <Files className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">No Resumes Yet</h2>
                <p className="mt-2 text-muted-foreground">
                    You haven't created any resumes. Let's build your first one!
                </p>
                <Button className="mt-6" asChild>
                    <Link href="/dashboard">
                        <FilePlus2 className="mr-2" /> Create Your First Resume
                    </Link>
                </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resumes.map((resume) => (
                <Card key={resume.id} className="flex flex-col">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="truncate">{resume.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center bg-muted/50">
                    <img
                      src={resume.previewUrl || 'https://placehold.co/400x566'}
                      alt={`Preview of ${resume.title}`}
                      className="object-contain rounded-sm aspect-[8.5/11] w-full"
                    />
                  </CardContent>
                  <CardFooter className="justify-between text-xs text-muted-foreground pt-4">
                    <span>Updated: {resume.updatedAt.toLocaleDateString()}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
