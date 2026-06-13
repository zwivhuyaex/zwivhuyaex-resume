# Development Guide

Follow these steps to contribute to or extend Zwivhuyaex CV.

## 1. Adding a New Resume Template

1. Open `src/components/ResumePreview.tsx`.
2. Add a new key to the `templates` object inside the component.
3. Define the JSX/CSS for your template.
4. Add the template name to the `Template` type and the `templateOptions` array in `src/app/dashboard/editor/page.tsx`.

## 2. Modifying AI Logic

1. Schemas: Update `src/ai/schemas.ts` if you want the AI to extract more data (e.g., Projects, Certifications).
2. Flows: Update `src/ai/flows/resume-revamp.ts` or `src/ai/flows/job-specific-optimization.ts` to change the prompt instructions.
3. Testing: Run `npm run genkit:dev` to open the Genkit Developer UI and test your prompts in isolation.

## 3. Deployment

This project is optimized for **Firebase App Hosting**.
- `apphosting.yaml` contains the runtime configuration.
- `firebase.json` handles hosting ignores.

### Steps to Deploy:
1. Ensure all environment variables are set in the Firebase Console (App Hosting secrets).
2. Connect your repository to Firebase App Hosting.
3. Deployment will happen automatically on push to the main branch.

## 4. Troubleshooting Hydration Errors

Next.js hydration errors are common when using dynamic values or dates.
- Use `useEffect` to set state that depends on `window` or `Date`.
- In `ResumePreview.tsx`, we use a fallback for date formatting to ensure server/client consistency.
- `suppressHydrationWarning` is used on the `<body>` tag in `layout.tsx` to ignore mismatches caused by browser extensions.