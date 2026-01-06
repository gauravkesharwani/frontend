# BlackKeyX - Real Estate Investment Platform

A Next.js web application for matching real estate investors with personalized investment opportunities.

## Features

- **Modern UI**: Built with Next.js 14+ App Router and Tailwind CSS
- **Interactive Chat**: Conversational qualification flow
- **Responsive Design**: Mobile-first, fully responsive design
- **Type-Safe**: Full TypeScript implementation
- **Form Validation**: Zod schemas for data validation
- **TCPA Compliant**: Built-in consent flow

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                    # Root layout with navigation
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles and Tailwind
│   ├── calculator/
│   │   ├── page.tsx                  # Main calculator interface
│   │   └── components/
│   │       ├── ChatInterface.tsx     # Chat UI component
│   │       ├── QualificationFlow.tsx # 3-question qualifier
│   │       ├── ConsentForm.tsx       # TCPA compliance form
│   │       └── PhoneInput.tsx        # Phone number capture
│   └── api/
│       └── submit-lead/
│           └── route.ts              # API route for lead submission
├── components/
│   └── ui/                           # Reusable UI components
├── lib/
│   ├── state-manager.ts              # Chat state management
│   ├── validation.ts                 # Zod schemas
│   └── utils.ts                      # Utility functions
├── types/
│   └── lead.ts                       # TypeScript interfaces
└── public/
    └── images/                       # Static assets
```

## Color Scheme

The design uses a professional blue and green color palette:

- **Primary Blue**: `#0066cc` (various shades)
- **Accent Green**: `#00cc66` (various shades)
- **Neutrals**: Grays for text and backgrounds

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The `/api/submit-lead` endpoint currently logs data to console. To integrate with a FastAPI backend:

1. Update the API route in `app/api/submit-lead/route.ts`
2. Set the `NEXT_PUBLIC_API_URL` environment variable
3. Uncomment the fetch call to forward data to FastAPI

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

The app can be deployed to Vercel, AWS, or any platform supporting Next.js:

```bash
npm run build
npm start
```

## License

Proprietary - All rights reserved
