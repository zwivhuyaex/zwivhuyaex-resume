# Development Guide

Follow these steps to contribute to or extend Zwivhuyaex CV.

## 1. Adding a New Resume Template

1. Open `src/components/ResumePreview.tsx`.
2. Add a new key to the `templates` object inside the component. Ensure it strictly defines the styling parameters.
3. Define the JSX/CSS layout for your template using Tailwind classes.
4. Add the template name to the `Template` type and the `templateOptions` array in `src/app/dashboard/editor/page.tsx`.

## 2. Modifying AI Logic (Genkit)

1. **Schemas**: Update `src/ai/schemas.ts` if you want the AI to extract or generate more data (e.g., Projects, Certifications, Awards).
2. **Flows**: Update `src/ai/flows/resume-revamp.ts` or `src/ai/flows/job-specific-optimization.ts` to change the prompt instructions or tweak the Gemini model parameters (temperature, max tokens).
3. **Testing flows**: Run `npm run genkit:dev` to open the Genkit Developer UI and test your prompts and schemas in an isolated environment.

## 3. Deployment

This project is optimized for modern serverless hosting platforms like **Vercel** and **Firebase App Hosting**.

### Option A: Vercel Deployment (Recommended)
Because of its native support for Next.js 15 App Router, Vercel is the primary recommended deployment path.

1. **Configuration**: Vercel handles Next.js deployments effortlessly. However, because Genkit uses backend-specific Node APIs (e.g., OpenTelemetry, Handlebars), you must ensure your `next.config.ts` includes `serverExternalPackages`:
   ```typescript
   serverExternalPackages: ['genkit', '@genkit-ai/core', '@opentelemetry/sdk-node', 'handlebars', '@opentelemetry/exporter-jaeger']
   ```
2. **Environment Variables**: Add all variables from your local `.env` into the Vercel project's Environment Variables settings before deployment.
3. **Deploy**: Link your GitHub repository to Vercel, and deployments will run automatically on push.

### Option B: Firebase App Hosting
- `apphosting.yaml` handles the runtime and CPU/memory configuration.
- `firebase.json` handles hosting configuration and ignore rules.

1. Ensure all environment variables are set in the Firebase Console (under App Hosting secrets).
2. Connect your repository to Firebase App Hosting.
3. Deployment will happen automatically on push to the `main` branch.

## 4. Troubleshooting Webpack & Hydration Errors

- **Server External Packages**: As mentioned above, Next.js may throw `Module not found` errors for Node backend libraries. Add them to the `serverExternalPackages` array in `next.config.ts` to prevent webpack from bundling them for the client edge.
- **Next.js Hydration Errors**: Next.js hydration errors are common when using dynamic values, browser extensions, or dates.
  - Use `useEffect` to set state that depends on `window` or `Date`.
  - In `ResumePreview.tsx`, we use a fallback for date formatting to ensure server/client consistency.
  - `suppressHydrationWarning` is used on the `<body>` tag in `layout.tsx` to ignore mismatches caused by certain browser extensions (like grammar checkers).