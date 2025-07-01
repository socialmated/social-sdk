# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Project Overview

This project is a unified SDK for interacting with various social media platforms. It aims to provide a consistent API for common social media operations, simplifying the process of integrating multiple platforms into applications.

## Objectives

- Develop a unified SDK that supports multiple social media platforms.
- Ensure the SDK provides a consistent interface for common operations.
- Implement built-in authentication mechanisms for each platform.
- Provide comprehensive documentation and examples for developers.
- Maintain high code quality and adhere to best practices in software development.
- Ensure the SDK is extensible for future platform additions.

## Toolchain

This project uses a modern JavaScript/TypeScript stack with the following tools:
- **TypeScript**: For type safety and better developer experience.
- **ESLint**: For code linting and maintaining code quality.
- **Prettier**: For code formatting to ensure consistent style.
- **Vitest**: For unit testing and integration testing.
- **pnpm**: For package management and monorepo support.
- **Husky**: For managing Git hooks to enforce code quality checks before commits.
- **Commitlint**: For enforcing commit message conventions.

## Folder Structure

This project utilizes a monorepo structure, each package is organized under the `packages/` directory.

There are shared packages that contain common logic and utilities used across different platform SDKs. The structure is as follows:
```
packages/
├── auth/                # Shared authentication logic
├── client/              # Shared client implementation for API interactions
├── core/                # Core interfaces and utilities
├── model/               # Unified data models for social media entities
```

Each platform has its own folder containing the SDK implementation for that specific platform:
```
.
├── src/
│   ├── index.ts          # Main entry point for the platform SDK
│   ├── auth              # Authentication-related code
│   ├── client            # Client implementation for API interactions
│   │   ├── api.ts        # Main API client implementation
│   │   └── http.ts       # HTTP client preset
│   ├── hooks             # Hooks for request and response handling
│   ├── mappers           # Data mappers for transforming API responses
│   ├── security          # Security-related utilities (e.g., encryption, signing)
│   ├── types             # Type definitions for the API requests and responses
│   └── utils             # Utility functions and helpers
```
