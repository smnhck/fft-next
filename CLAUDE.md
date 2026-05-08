# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Franzis fabelhafte Törtchen" (FFT) — a German-language cake/bakery website built with Next.js 14 (App Router) and Tailwind CSS v4. Content is sourced from Contentful CMS via its GraphQL API. Deployed on Vercel.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals config)
- No test framework is configured

## Architecture

**Routing (App Router):** `app/` uses Next.js file-based routing. German URL slugs (`/kontakt`, `/ueber-mich`). Dynamic routes: `[cakeCategory]` for category listings, `[cakeCategory]/[cake]` for individual cake pages.

**Data layer:** `lib/api.ts` — all Contentful interaction. Uses GraphQL to fetch cake entries. Two exports: `getAllCakes(limit, isDraftMode)` and `getCake(slug, isDraftMode)`. Fetches are tagged with `"cakes"` for ISR revalidation.

**Components:** Organized as `atoms/` and `molecules/` under `components/`. Top-level components (`stage.tsx`, `categoryChoice.tsx`, `testimonials.tsx`) are page sections used on the homepage.

**Styling:** Tailwind CSS v4 with `@import "tailwindcss"` in `globals.css`. Custom theme colors defined in `@theme` block (`--color-primary`, `--color-primary-dark`, `--color-secondary`, `--color-black-*`). Local fonts loaded via `next/font/local` in `app/fonts.ts` (Overlock as body, GreatVibes as decorative).

**Images:** Contentful images served from `images.ctfassets.net` (configured in `next.config.js` remote patterns). Cloudinary integration available via `next-cloudinary`.

## Environment Variables

Requires in `.env`: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_PREVIEW_ACCESS_TOKEN`.

## Key Conventions

- Path alias: `@/*` maps to project root (e.g., `@/lib/api`, `@/components/...`)
- Language: site content is German, code/comments are English
- HTML lang is `de-DE`
