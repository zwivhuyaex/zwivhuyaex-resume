import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
       <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
           <div className="glass-card rounded-lg p-8">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight font-headline">
                  Reset Your Password
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Enter your email and we'll send you a link to get back into your account.
                </p>
              </div>
              <ForgotPasswordForm />
               <p className="mt-4 text-center text-sm text-muted-foreground">
                Remembered your password?{' '}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary font-bold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
}
