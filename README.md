# Zwivhuyaex CV - The Perfect CV, Made Easy

Zwivhuyaex CV is an ultramodern, AI-powered resume builder and optimizer designed to help professionals land their dream jobs. By leveraging Google's Genkit and Gemini AI, the platform extracts information from existing documents, revamps content for professional impact, and optimizes resumes for specific job descriptions.

## 🚀 Key Features.

- **AI-Powered Extraction**: Upload PDF, DOCX, or TXT resumes and let AI structure your data.
- **Content Revamping**: Automatically rewrite summaries and responsibilities to be more impactful and professional.
- **Job-Specific Optimization**: Tailor your resume to a specific job description to pass ATS filters.
- **Side-by-Side Editor**: Real-time editing with a live preview of your resume.
- **12+ Premium Templates**: Choose from Academic, Modern, Technical, Executive, and more.
- **High-Quality PDF Export**: Download professional-grade PDFs instantly.
- **Futuristic UI**: A sleek, dark-themed interface with glassmorphism effects and smooth animations.
- **Responsive Design**: Seamless experience across desktop and mobile devices.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Engine**: [Genkit](https://github.com/firebase/genkit) with Google Gemini 2.0 Flash
- **Backend**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Fonts**: Sora (Headlines), Space Mono (Code/Technical)
- **PDF Generation**: `html2canvas` & `jsPDF`
- **Document Parsing**: `pdfjs-dist` (PDF) & `mammoth` (DOCX)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- A Firebase Project
- A Google AI (Gemini) API Key

### Environment Variables

Create a `.env` file in the root directory and add your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI (Genkit)
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/ai`: Genkit AI flows, prompts, and schemas.
- `src/components`: Reusable UI components and resume templates.
- `src/hooks`: Custom React hooks (e.g., `use-mobile`).
- `src/lib`: Utility functions and Firebase initialization.
- `docs`: Detailed technical and architectural documentation.

## 📄 Documentation

For more detailed information, please refer to the files in the `docs/` folder:

- [Architecture Guide](./docs/ARCHITECTURE.md) - Deep dive into AI and PDF logic.
- [AI Workflow](./docs/AI_WORKFLOWS.md) - Explanation of Gemini integration.
- [Development Guide](./docs/DEVELOPMENT.md) - How to extend the app.

## 📜 License

This project is private and intended for use within Firebase Studio.

---
© 2025 Zwivhuyaex CV. All rights reserved.