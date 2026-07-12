# Sprout

An offline-first plant care tracker focused on **reliable scheduling**, **data privacy**, and a **mobile-first** experience.

The app helps users track plant care schedules by calculating watering, fertilizing, and repotting intervals based on multiple plant-specific factors such as:

- plant type
- pot size
- sunlight exposure
- plant size
- watering history

The scheduling system dynamically adapts to user behavior and environmental changes.
For example:

- early watering adjusts future watering intervals
- increased heat exposure can shorten predicted watering cycles
- user activity continuously influences reminder calculations

> Status: Active development of Base Structure and Core Features

> Planned first public release: Q3 2026

> The project evolved from an earlier prototype and is currently being rebuilt as a Progressive Web App using React and TypeScript.

## Screenshots

<img width="200" height="100" alt="image" src="https://github.com/user-attachments/assets/d6346e2f-0cc0-4af1-b3c3-c45c5513e0d8" />
<img width="200" height="100" alt="image" src="https://github.com/user-attachments/assets/82624012-ec92-4c86-8098-914fb61b5323" />
<img width="200" height="100" alt="image" src="https://github.com/user-attachments/assets/6ad14f2e-6842-4c0a-985c-25f84ef70cb0" />
<img width="200" height="100" alt="image" src="https://github.com/user-attachments/assets/5604a8f4-639b-4f34-8a6e-45f9fb17cbaa" />

Please keep in mind that the design can still change, its only the first draft and layout!

## Tech Stack

**Frontend**

- React + TypeScript
- Vite

**UI**

- Tailwind CSS
- shadcn/ui

**State & Data**

- Zustand (local app state)
- Dexie.js (IndexedDB persistence, offline-first)
- Zod (runtime validation / schemas)
- React Hook Form (forms + validation integration)

**PWA / Offline**

- vite-plugin-pwa (Service Worker, caching, installability)

## Features

### Implemented Features

### Planned Features

- plant creation and management
- Algorithm which calcutlates next watering, fertilizing and repotting dates based on plant type, pot dimensions, material and drainage hole, sunlight exposure, plant size and watering history
- If watering is done earlier or later than expected, the algorithm will adjust the next watering date accordingly
- local encrypted storage
- priority-based plant overview
- offline-first architecture
- mobile push notifications
- plant artwork / illustrations
- advanced environmental adjustments
- Dark and Light Mode and seasonal Themes
- Donation button with possibility to show support
- Photos added to each plant to track growth and health
- Possibility to create custom cycles for watering, fertilizing and repotting for each plant

## Technical Focus

This project focuses heavily on:

- maintainable code structure
- modular architecture
- practical performance
- user data protection
- offline reliability
- long-term extensibility
