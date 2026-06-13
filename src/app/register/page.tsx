
import { AuthForm } from '@/components/auth/AuthForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';

export default function RegisterPage() {
  return (
     <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
           <div className="glass-card rounded-lg p-8">
              <div className="flex flex-col space-y-2 text-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight font-headline">
                  Create an account
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Enter your email below to start your journey.
                </p>
              </div>
              <AuthForm mode="signup" />
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary font-bold"
                >
                  Sign In
                </Link>
              </p>
          </div>
           <p className="px-8 text-center text-xs text-muted-foreground font-body mt-8">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
