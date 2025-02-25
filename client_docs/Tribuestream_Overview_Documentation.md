# Tribuestream Overview Documentation

_Last Updated: 2025-02-25_

## Foreword
This document serves as the master overview for the Tribuestream application built with SvelteKit 5. It consolidates various design and technical documents including architecture overviews, API documentation, form persistency, API schema plans, and the memorial service calculator guides. Its purpose is to provide a single source of truth for developers, architects, and stakeholders, clarifying the app's layout, architecture, and integration with WordPress via a custom API proxy.

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture Overview](#system-architecture-overview)
3. [Frontend Layout and Structure](#frontend-layout-and-structure)
4. [API Proxy and Integration](#api-proxy-and-integration)
5. [Memorial Service Calculator](#memorial-service-calculator)
   - [Technical Documentation](#technical-documentation)
   - [User Guide](#user-guide)
6. [Future Improvements and Considerations](#future-improvements-and-considerations)
7. [Conclusion](#conclusion)
8. [References](#references)

## Introduction
Tribuestream is a modern SvelteKit 5 application designed to interface seamlessly with a WordPress backend via a custom REST API plugin. The application combines state-of-the-art frontend technologies with robust server-side integrations, including JWT authentication, user metadata management, and a sophisticated memorial service calculator. This document provides a comprehensive overview of the system, detailing configuration, data flows, API endpoints, and user interactions.

## System Architecture Overview
The architecture of Tribuestream is organized into several key components:
- **Frontend Application**: Built with SvelteKit 5 and Tailwind CSS, it manages client-side routing, UI rendering, and state management using Svelte 5 runes.
- **WordPress Backend**: Hosts a custom REST API plugin featuring endpoints for authentication, user management, media handling, and tribute operations.
- **API Proxy Layer**: Located at `TribustreamMegaMerge/src/routes/api/`, this layer facilitates communication between the frontend and WordPress, handling endpoints such as `auth`, `getRole`, `logout`, `register`, `send-email`, `tributes`, and `user-meta`.
- **Memorial Service Calculator**: A specialized component for scheduling and pricing memorial services, integrating form data persistency and real-time price calculations.

This document integrates insights from form persistence strategies, server-side processing, cookie management, and the synchronization of multi-day event data, all derived from internal documentation.

## Frontend Layout and Structure
Tribuestream leverages SvelteKit's file-based routing and component-driven architecture. Key structural elements include:
- **src/app.html**: The main HTML template.
- **src/hooks.server.ts**: Server hooks for lifecycle management.
- **src/lib/components/**: Contains reusable UI components, including layout components and specialized components like `MemorialCalculator.svelte`.
- **src/routes/**: Houses the application routes including API endpoints, form handling (`fd-form`), calculator-specific routes (`calc`), and authentication pages.
- **State Management**: Utilizes Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactive UI updates and data binding.

## API Proxy and Integration
The API proxy layer is crucial for secure and efficient communication between the frontend and the WordPress backend. The following aspects define this integration:

### API Endpoint Structure
Directory: `TribustreamMegaMerge/src/routes/api/`
- **auth/**: Handles user authentication with JWT token management.
- **getRole/**: Retrieves user roles for access control.
- **logout/**: Clears authentication tokens.
- **register/**: Manages user registration.
- **send-email/**: Sends email notifications using services like SendGrid.
- **tributes/**: Manages tribute data operations including search, retrieval, and updates.
- **user-meta/**: Interfaces with WordPress user metadata for storing form and calculator data.

### API Documentation Highlights
Information consolidated from various documents:
- **Authentication**: Endpoints to login, logout, and register, using JWT for secure sessions.
- **User Management**: Retrieval and update of user metadata along with role information.
- **Tribute Operations**: Endpoints to search tributes, fetch individual tribute details, and handle pagination.
- **Error Handling and Security**: Consistent error response formats and HTTPS-enforced endpoints.

### TypeScript Interfaces
As outlined in the API schema plan, interfaces cover:
- Tribute structures (creation, update, retrieval).
- Authentication responses.
- User meta operations.
- Generic API response and error interfaces.

These types ensure that backend responses are strictly typed and integrated seamlessly into the application.

## Memorial Service Calculator
The Memorial Service Calculator is a core feature providing both technical and user-facing functionalities.

### Technical Documentation
The calculator leverages a multi-step process for data flow:
- **Layout Server (`+layout.server.ts`)**: Manages JWT authentication, parses cookies, and transforms WordPress metadata.
- **Calculator Page Server (`+page.server.ts`)**: Inherits data from the layout for streamlined processing.
- **Calculator Component (`MemorialCalculator.svelte`)**: Implements state management using Svelte 5 runes, handles pricing calculations (base package, extra locations, additional duration), and synchronizes data with user metadata.
- **Data Structures**: Includes interfaces for memorial form data, calculator data (schedule days, cart items, totals), and state management logic. Code examples from internal documentation illustrate the reactive update process, utilizing `$state`, `$derived`, and `$effect`.

### User Guide
The user guide provides step-by-step instructions for interacting with the calculator:
- **Getting Started**: Access the scheduling page and choose a package.
- **Package Selection**: Options include Tributestream Solo, Gold, and Legacy, each with defined pricing and features.
- **Scheduling Services**: Instructions for adding days, setting dates/times, and managing locations.
- **Pricing Overview**: Detailed explanation of base costs, additional location fees, and extra duration charges. Sample pricing scenarios provided for clarity.
- **Saving and Checkout**: Guidelines for saving schedules and completing the booking process.
- **Tips and Best Practices**: Recommendations for verifying venue availability, travel time considerations, and cost optimization strategies.

## Future Improvements and Considerations
The current documentation points to several areas for enhancement:
- **State Management**: Consider integrating a more comprehensive state management solution for complex interactions.
- **Data Validation and Caching**: Implement stricter type checking and client-side caching mechanisms.
- **Real-Time Synchronization**: Explore WebSocket integration for live updates.
- **API Enhancements**: Further refine endpoints for rate limiting, advanced search filters, and bulk operations.
- **Documentation Consolidation**: Resolve redundant elements and maintain a single source of truth to ease developer onboarding and ongoing maintenance.

## Conclusion
This document provides a unified, comprehensive overview of the Tribuestream application—from detailed architectural insights and component structures to API integrations and user guides for key features, such as the Memorial Service Calculator. It serves as the living documentation for continuing development and future improvements.

## References
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- Internal Documents:
  - 01-A-form-persistency.md
  - 01-architecture-overview.md
  - 02-api-documentation.md
  - api-schema-plan.md
  - memorial-calculator-technical.md
  - memorial-calculator-user-guide.md