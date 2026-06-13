# AI Workflows & Prompts

Zwivhuyaex CV leverages Google's Gemini models through the Genkit framework. This document explains how the AI is prompted and how it returns data.

## 1. Schemas (`src/ai/schemas.ts`)

We use **Zod** to define the shape of data the AI must return. This ensures type safety and predictable UI behavior.

Key Schema: `ResumeRevampOutputSchema`
- `personalInfo`: Name, email, phone, etc.
- `professionalSummary`: String.
- `workExperience`: Array of objects with specific date formats.
- `skills`: Comma-separated string.

## 2. Prompts

### Extraction & Revamp
The prompt instructs Gemini to be an "expert resume writer and data extractor." It emphasizes:
- Parsing messy raw text into structured JSON.
- Improving professional tone.
- Handling "Present" or "Current" dates by setting `isCurrentJob: true`.

### Job Optimization
The prompt for this flow instructs the AI to:
- Be subtle.
- Only modify summary and responsibilities.
- **Crucially**: Store the original text in the `original` fields so the user can compare changes in the UI.

## 3. Performance Considerations

- **Model Choice**: Gemini 2.0 Flash is used for its speed and high context window, making it ideal for processing long resumes and job descriptions quickly.
- **Streaming**: While current flows are non-streaming for structural integrity, future updates may implement `generateStream` for UI responsiveness.