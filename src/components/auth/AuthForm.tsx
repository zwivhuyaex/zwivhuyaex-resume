'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type UserFormValue = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setIsLoading(true);
    if (mode === 'login') {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Sign In Successful", description: "Welcome back!" });
        router.push('/dashboard/profile');
      } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: "Invalid email or password. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else { // mode === 'signup'
      try {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Account Created", description: "You have been successfully signed up!" });
        router.push('/dashboard/profile');
      } catch (error: any) {
        let description = "Could not create your account. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This email is already in use. Please sign in instead.";
        }
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const onGoogleSignIn = async () => {
     setIsLoading(true);
     try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.push('/dashboard/profile');
     } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: error.message || 'An unexpected error occurred during sign-in.',
        });
     } finally {
        setIsLoading(false);
     }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  {mode === 'login' && (
                     <Link href="/forgot-password" passHref>
                      <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                        Forgot Password?
                      </span>
                    </Link>
                  )}
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={onGoogleSignIn}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.7 96 248 96c-106.1 0-192 85.9-192 192s85.9 192 192 192c106.1 0 192-85.9 192-192 0-21.2-3.6-41.6-10-60.9H248v-87.8h239.1c5.5 31.3 8.9 64.1 8.9 98.2z"></path></svg>
        )}{' '}
        Google
      </Button>
    </div>
  );
}
