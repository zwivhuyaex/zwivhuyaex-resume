# Zwivhuyaex Resume - Professional CV Builder

<div align="center">
  <img src="https://placehold.co/600x200/2a2a2a/ffffff?text=Zwivhuyaex+Resume" alt="Zwivhuyaex Resume Banner" width="100%" />
</div>

Zwivhuyaex Resume is an ultramodern, AI-powered resume builder and optimizer designed to help professionals land their dream jobs. By leveraging Google's Genkit and Gemini AI, the platform extracts information from existing documents, revamps content for professional impact, and optimizes resumes for specific job descriptions.

## 🚀 Key Features

- **AI-Powered Extraction**: Upload PDF, DOCX, or TXT resumes and let AI structure your data natively using Google Gemini 2.0.
- **Content Revamping**: Automatically rewrite summaries and responsibilities to be more impactful, concise, and professional.
- **Job-Specific Optimization**: Tailor your resume to a specific job description to pass ATS (Applicant Tracking System) filters effortlessly.
- **Side-by-Side Editor**: Real-time WYSIWYG editing with a live, accurate preview of your resume.
- **12+ Premium Templates**: Choose from Academic, Modern, Technical, Executive, and other industry-tailored designs.
- **High-Quality PDF Export**: Download professional-grade, print-ready PDFs instantly without watermarks (premium).
- **Futuristic UI**: A sleek, dark-themed interface with glassmorphism effects, intelligent micro-interactions, and smooth animations.
- **Responsive Design**: A seamless, mobile-first experience across desktop, tablet, and smartphone devices.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) for server-rendered UI and seamless API integrations.
- **AI Engine**: [Genkit](https://github.com/firebase/genkit) combined with Google Gemini 2.0 Flash for structured outputs.
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore) for secure data persistence.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) for rapid, accessible UI components.
- **Typography**: Sora (Headlines) and Space Mono (Code/Technical elements).
- **PDF Generation**: `html2canvas` & `jsPDF` for client-side rendering fidelity.
- **Document Parsing**: `pdfjs-dist` (PDF parsing) & `mammoth` (DOCX parsing).

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed and configured before starting:

- **Node.js** (v20 or higher)
- **Firebase Project**: Setup Authentication and Firestore.
- **Google AI Studio**: Obtain a valid Gemini API Key.

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

### Installation & Execution

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/zwivhuyaex/zwivhuyaex-resume.git
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```
.
├── src/
│   ├── ai/            # Genkit AI flows, prompts, and Zod schemas
│   ├── app/           # Next.js App Router pages and layouts
│   ├── components/    # Reusable Shadcn UI components and Resume templates
│   ├── hooks/         # Custom React hooks (e.g., use-mobile)
│   └── lib/           # Utility functions, helpers, and Firebase init
├── Documentation/     # In-depth architectural and developer documentation
├── next.config.ts     # Next.js configuration (with Genkit external packages)
└── tailwind.config.ts # Tailwind CSS theme and styling configuration
```

## 🚀 Deployment

This application can be seamlessly deployed to platforms like **Vercel** or **Firebase App Hosting**. 

### Vercel Deployment
The project is already pre-configured to handle Genkit dependencies in Edge environments. Vercel automatically detects the Next.js project. Ensure you add all `.env` variables to your Vercel Project Settings before initiating the deployment.

For detailed instructions, see the [Development Guide](./Documentation/DEVELOPMENT.md).

## 📄 Documentation

For more detailed information, please refer to the files in the `Documentation/` folder:

- [Architecture Guide](./Documentation/ARCHITECTURE.md) - Deep dive into Genkit AI integration and PDF rendering logic.
- [AI Workflows](./Documentation/AI_WORKFLOWS.md) - Explanation of Gemini prompts, data extraction, and structured schemas.
- [Development Guide](./Documentation/DEVELOPMENT.md) - How to extend the app, add templates, and troubleshoot Next.js issues.
- [Blueprint](./Documentation/blueprint.md) - Original project specifications and UI/UX design guidelines.

## 📜 License

This project is intended for use within the Zwivhuyaex CV platform ecosystem.

---
© 2026 Zwivhuyaex CV. All rights reserved.
