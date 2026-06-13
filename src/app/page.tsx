
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, MoveRight, Sparkles, Library, FileDown, MessageCircleQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/Footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';
import { Menu } from 'lucide-react';


function LandingHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-left">
              <span className="font-bold font-headline text-lg block leading-none">Zwivhuyaex CV</span>
              <span className="text-xs text-muted-foreground leading-none">The Perfect CV, Made Easy.</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
             <Link href="/dashboard" className="transition-colors hover:text-primary">Build Resume</Link>
            <Link href="#" className="transition-colors hover:text-primary">Templates</Link>
            <Link href="#" className="transition-colors hover:text-primary">FAQ</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-background/90 backdrop-blur-lg">
            <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                     <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                        <div className="text-left">
                        <span className="font-bold font-headline text-lg block leading-none">Zwivhuyaex CV</span>
                        <span className="text-xs text-muted-foreground leading-none">The Perfect CV, Made Easy.</span>
                        </div>
                    </Link>
                </div>
                <nav className="flex flex-col gap-4 p-4 text-base font-medium">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary">Build Resume</Link>
                    <Link href="#" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary">Templates</Link>
                    <Link href="#" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary">FAQ</Link>
                </nav>
                <div className="mt-auto p-4 border-t space-y-2">
                    <Button variant="ghost" asChild className="w-full">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                        <Link href="/register">Sign Up</Link>
                    </Button>
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

const features = [
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Content',
    description: "Let our AI rewrite and enhance your resume text, ensuring it's professional, impactful, and tailored to your industry.",
  },
  {
    icon: <Library className="h-10 w-10 text-primary" />,
    title: 'Expert Templates',
    description: 'Choose from a curated selection of ATS-friendly templates designed by career experts to impress any recruiter.',
  },
  {
    icon: <FileDown className="h-10 w-10 text-primary" />,
    title: 'Instant PDF Downloads',
    description: 'Download your finished resume instantly as a high-quality, professional PDF, ready to send out.',
  },
];

const faqs = [
  {
    question: "How does the AI resume revamping work?",
    answer: "Our advanced AI analyzes the content of your resume, identifying areas for improvement. It then rewrites sections to enhance clarity, impact, and keyword optimization, ensuring your skills and experience are presented in the best possible light."
  },
  {
    question: "Are the templates Applicant Tracking System (ATS) friendly?",
    answer: "Yes, all of our templates are designed with modern ATS requirements in mind. They use clean, readable fonts and a professional structure to ensure your resume is parsed correctly by automated screening systems."
  },
  {
    question: "Can I try it for free?",
    answer: "Absolutely! You can use our resume revamping and optimization tools to see the AI-generated improvements. Downloading the final resume in a premium template without a watermark requires a subscription."
  },
  {
    question: "What if I'm not happy with the AI's suggestions?",
    answer: "The AI provides a powerful starting point, but you always have the final say. You can easily edit the AI-generated content in our editor, combining the AI's suggestions with your own personal touch to create the perfect resume."
  }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
           <div className="absolute inset-0 bg-grid-primary/10 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)] -z-10"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent -z-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] -z-20"></div>

          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 font-headline">
                Your Future, <span className="text-primary">Perfectly Written</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
                Transform your career prospects with an AI-crafted resume that captures your unique skills. Build a document that not only looks professional but truly represents you.
              </p>
              <Button size="lg" asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                <Link href="/dashboard">
                  Start Building My Resume <MoveRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by over 10,000+ professionals
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                Why Choose <span className="text-primary">Zwivhuyaex CV</span>?
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                Our platform is built to give you a competitive edge in the job market.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center glass-card hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground font-headline">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
               <MessageCircleQuestion className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                Have questions? We've got answers. Here are some common queries.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-lg mb-2 px-4">
                    <AccordionTrigger className="text-lg font-headline text-left hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base font-body text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-headline">
                Contact Us
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                We're here to help with any questions you may have.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message..." />
                    </div>
                    <Button type="submit" className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
