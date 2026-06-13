# Technical Architecture

This document outlines the core architectural decisions and systems within Zwivhuyaex CV.

## 1. AI Integration (Genkit & Gemini)

The application uses **Genkit** to manage complex AI workflows. There are two main server-side flows:

### Resume Revamp Flow (`resume-revamp.ts`)
- **Input**: Raw text extracted from a user's uploaded file.
- **Process**: Gemini 2.0 Flash analyzes the text and maps it to a structured JSON schema (`ResumeRevampOutputSchema`). It also improves the tone and clarity of the content.
- **Output**: A structured resume object including personal info, summary, experience, education, and skills.

### Job Optimization Flow (`job-specific-optimization.ts`)
- **Input**: The structured resume and a job description string.
- **Process**: The AI compares the resume against the job description and suggests modifications to the professional summary and work responsibilities to align with specific keywords.
- **Output**: Updated structured resume with tracked changes (original text is preserved in `original...` fields).

## 2. Resume Rendering & Templates

The rendering engine is centralized in `src/components/ResumePreview.tsx`. 

- **State Management**: The editor uses local state and `sessionStorage` to pass data between the dashboard and the editor page.
- **Template Logic**: Over 12 distinct templates (Academic, Modern, Technical, etc.) are implemented using Tailwind CSS. 
- **PDF Generation**: 
  1. `html2canvas` captures the rendered DOM element of the resume.
  2. `jsPDF` takes that canvas and places it into an A4 PDF document.
  3. This client-side approach ensures that fonts and styles are preserved exactly as seen in the browser.

## 3. Data Flow

1. **Dashboard**: User uploads a file. `pdfjs-dist` or `mammoth` extracts the text.
2. **AI Processing**: The text is sent to the server-side Genkit flows.
3. **Storage**: The resulting structured JSON is stored in `sessionStorage`.
4. **Editor**: The data is loaded from `sessionStorage`. The user can edit any field.
5. **Persistence**: Currently, resumes are managed session-to-session. Future updates will include Firestore persistence linked to the user's UID.

## 4. UI/UX Strategy

- **Theme**: A futuristic dark mode by default (`globals.css`), using CSS variables for primary colors.
- **Animations**: Subtle entry animations for cards and loaders to enhance the "AI" feel.
- **Glassmorphism**: Semi-transparent cards with `backdrop-blur` for a modern look.