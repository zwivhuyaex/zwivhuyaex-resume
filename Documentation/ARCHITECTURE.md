# Technical Architecture

This document outlines the core architectural decisions and systems within Zwivhuyaex CV.

## 1. AI Integration (Genkit & Gemini)

The application uses Google's **Genkit** to manage complex AI workflows securely on the server-side. There are two primary flows:

### Resume Revamp Flow (`resume-revamp.ts`)
- **Input**: Raw, unformatted text extracted from a user's uploaded document (PDF/DOCX).
- **Process**: Gemini 2.0 Flash analyzes the text and accurately maps it to a structured, type-safe JSON schema (`ResumeRevampOutputSchema`). It simultaneously improves the tone, clarity, and professionalism of the content.
- **Output**: A perfectly structured resume object encompassing personal info, professional summary, work experience, education, and skills.

### Job Optimization Flow (`job-specific-optimization.ts`)
- **Input**: The structured resume JSON and a raw job description string.
- **Process**: The AI analyzes the candidate's resume against the requirements of the job description. It suggests strategic modifications to the professional summary and work responsibilities to organically include relevant keywords and pass Applicant Tracking Systems (ATS).
- **Output**: An updated structured resume with tracked changes (original text is preserved in `original...` fields, allowing the frontend to highlight what the AI modified).

## 2. Server vs Client Boundaries

Due to Next.js App Router's architecture, clear boundaries are established:
- **Server Actions/API Routes**: Genkit flows run **strictly** on the server. Next.js is configured via `serverExternalPackages` in `next.config.ts` to ensure Genkit's Node.js dependencies (like `handlebars`, OpenTelemetry) are not bundled for the client, avoiding Webpack build failures on platforms like Vercel.
- **Client Components**: The visual Resume Editor and Dashboard components are strictly client-side to manage real-time React state.

## 3. Resume Rendering & Templates

The rendering engine is centralized in `src/components/ResumePreview.tsx`. 

- **State Management**: The editor uses local React state and `sessionStorage` to temporarily pass parsed data between the dashboard and the editor workspace.
- **Template Logic**: Over 12 distinct, premium templates (Academic, Modern, Technical, Executive, etc.) are implemented programmatically using Tailwind CSS classes.
- **PDF Generation Pipeline**: 
  1. `html2canvas` takes a high-fidelity snapshot of the rendered DOM element of the resume preview.
  2. `jsPDF` calculates the dimensions and places the canvas snapshot into a standard A4 or US Letter PDF document.
  3. This entirely client-side approach ensures that all custom fonts, SVGs, and CSS styling rules are preserved exactly as seen by the user in the browser.

## 4. End-to-End Data Flow

1. **Upload**: User uploads a file from the Dashboard.
2. **Extraction**: `pdfjs-dist` (for PDFs) or `mammoth` (for DOCX) extracts raw text in the browser.
3. **AI Processing**: The raw text is dispatched securely to the server-side Genkit flows.
4. **Local Storage**: The resulting structured JSON is returned and stored in `sessionStorage`.
5. **Editing**: The Editor page hydrates the data from `sessionStorage`. The user edits fields in real-time, instantly reflecting on the `ResumePreview`.
6. **Persistence Strategy**: Currently, resumes are managed on a session-to-session basis. Future architectural updates will integrate Firestore persistence linked securely to the user's Firebase Authentication UID.

## 5. UI/UX Strategy & Styling

- **Theme**: A visually striking, futuristic dark mode by default (`globals.css`), leveraging CSS variables for primary and accent colors to ensure a cohesive brand identity.
- **Micro-interactions & Animations**: Subtle entry animations for cards and loading states (like the AI thinking indicator) to enhance the platform's intelligent, responsive feel.
- **Glassmorphism**: Extensive use of semi-transparent cards with Tailwind's `backdrop-blur` utilities to create a modern, layered visual hierarchy.