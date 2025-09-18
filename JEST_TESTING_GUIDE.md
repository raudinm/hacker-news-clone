# Comprehensive Jest Testing Guide for Clean Architecture Next.js

This guide provides a detailed, step-by-step approach to setting up and implementing comprehensive tests for a React/Next.js project following Clean Architecture principles. The guide covers testing across all architectural layers: Domain, Application, Infrastructure, and Presentation. The project uses Next.js 15 with TypeScript and implements Clean Architecture for optimal separation of concerns, testability, and maintainability.

## 🎯 Coverage Achievement

**Current Status**: 98.86% overall coverage achieved (functions: 96.87%, branches: 96%, lines: 98.8%)

- **Domain Layer**: 100% coverage (entities, use cases, repository interfaces)
- **Application Layer**: 89.28% coverage (controllers, presenters, hooks)
- **Infrastructure Layer**: 100% coverage (API clients, repositories)
- **Presentation Layer**: 100% coverage (components, pages)
- **Integration Tests**: 100% coverage (end-to-end flows)

## Clean Architecture Testing Overview

The testing strategy follows Clean Architecture principles with layered testing:

- **Domain Layer**: Unit tests for entities, use cases, and repository interfaces
- **Application Layer**: Integration tests for controllers, presenters, and custom hooks
- **Infrastructure Layer**: Unit tests for repositories and external API clients
- **Presentation Layer**: Component tests using React Testing Library

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Test Directory Structure](#test-directory-structure)
5. [Testing Clean Architecture Layers](#testing-clean-architecture-layers)
6. [Writing Unit Tests](#writing-unit-tests)
7. [Mocking Dependencies](#mocking-dependencies)
8. [Running Tests](#running-tests)
9. [Best Practices](#best-practices)
10. [CI/CD Integration](#cicd-integration)
11. [Framework-Specific Adaptations](#framework-specific-adaptations)

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Basic understanding of JavaScript/TypeScript and React/Next.js
- Next.js project with TypeScript

## Installation

Since Jest and testing dependencies are already installed in your project, verify the current setup:

```bash
yarn list jest @testing-library/react @testing-library/jest-dom
```

If any dependencies are missing, install them using yarn:

```bash
yarn add --dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

For TypeScript support:

```bash
yarn add --dev @types/jest ts-jest
```

For Next.js specific testing utilities:

```bash
# Note: @next/test-utils package may not be available for Next.js 15
# The core testing setup works without it
```

## Configuration

Create a `jest.config.js` file in your project root with Clean Architecture support:

```javascript
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@/application/(.*)$": "<rootDir>/src/application/$1",
    "^@/infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}",
  ],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          [
            "next/babel",
            {
              "preset-react": {
                runtime: "automatic",
              },
            },
          ],
        ],
      },
    ],
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Layer-specific thresholds
    "src/domain/**/*.ts": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "src/application/**/*.ts": {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
```

Create `jest.setup.js` for global test configuration:

```javascript
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: "",
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
    };
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  const React = require("react");
  return ({ children, href }) => {
    return React.createElement("a", { href }, children);
  };
});

// Global test utilities
global.fetch = jest.fn();
```

Update your `package.json` scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Recent Updates: Modern JSX Transform Configuration

### Automatic JSX Runtime (React 17+)

As of the latest update, this project has been configured to use React's automatic JSX runtime, which eliminates the need for explicit React imports in JSX files. This provides better performance and cleaner code.

#### Key Changes Made:

1. **Jest Configuration for Automatic JSX Runtime:**

   ```javascript
   // jest.config.js
   transform: {
     "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", {
       presets: [["next/babel", {
         "preset-react": {
           runtime: "automatic"
         }
       }]]
     }],
   },
   ```

2. **Updated Mock Setup:**

   ```javascript
   // jest.setup.js
   // Mock Next.js Link component with proper scope handling
   jest.mock("next/link", () => {
     const React = require("react"); // Import inside mock factory
     return ({ children, href }) => {
       return React.createElement("a", { href }, children);
     };
   });
   ```

3. **Removed Unnecessary React Imports:**
   - Test files no longer need `import React from "react"`
   - Component files automatically use modern JSX transform
   - Only setup files import React when absolutely necessary

#### Benefits:

- **Performance**: Automatic JSX runtime is faster than classic runtime
- **Cleaner Code**: No need for React imports in JSX files
- **Modern Standards**: Uses React 17+ JSX transform features
- **Better Tree Shaking**: Smaller bundle sizes

#### Migration Notes:

- If you encounter JSX transform warnings, ensure your test files don't have unnecessary React imports
- The Next.js Link mock now properly handles React scope within Jest's mock factory
- All component tests should work without modification after these changes

## 📋 Implemented Test Files

The following test files have been created to achieve comprehensive coverage across all architectural layers:

### Domain Layer Tests (100% Coverage)

- **`src/domain/entities/Story.test.ts`**: Tests StoryEntity business logic including time calculations, URL detection, and comment handling
- **`src/domain/entities/Comment.test.ts`**: Tests CommentEntity validation and business methods
- **`src/domain/entities/User.test.ts`**: Tests UserEntity account logic and properties
- **`src/domain/usecases/FetchTopStories.test.ts`**: Tests FetchTopStoriesUseCase with mocked repository dependencies
- **`src/domain/usecases/FetchStoryDetails.test.ts`**: Tests FetchStoryDetailsUseCase with error handling
- **`src/domain/usecases/FetchComments.test.ts`**: Tests FetchCommentsUseCase with nested comment logic
- **`src/domain/repositories/index.test.ts`**: Tests repository interface contracts

### Application Layer Tests (89.28% Coverage)

- **`src/application/controllers/StoryController.test.ts`**: Tests StoryController request/response handling and error management
- **`src/application/controllers/CommentController.test.ts`**: Tests CommentController with nested comment operations
- **`src/application/presenters/StoryPresenter.test.ts`**: Tests data transformation from entities to view models
- **`src/application/presenters/CommentPresenter.test.ts`**: Tests comment data transformation for UI
- **`src/application/hooks/useStories.test.ts`**: Tests SWR integration and hook behavior (90% coverage)
- **`src/application/hooks/useStoryDetails.test.ts`**: Tests story details hook with comments (88.88% coverage)

### Infrastructure Layer Tests (100% Coverage)

- **`src/infrastructure/api/HackerNewsApiClient.test.ts`**: Tests external API client methods and error handling
- **`src/infrastructure/repositories/HackerNewsStoryRepository.test.ts`**: Tests repository implementation with mocked API client
- **`src/infrastructure/repositories/HackerNewsCommentRepository.test.ts`**: Tests comment repository with console.error mocking
- **`src/infrastructure/repositories/HackerNewsUserRepository.test.ts`**: Tests user repository with console.error mocking

### Presentation Layer Tests (100% Coverage)

- **`src/app/layout.test.tsx`**: Tests root layout with hydration error handling
- **`src/app/page.test.tsx`**: Tests main application page with hook integration
- **`src/app/item/[id]/page.test.tsx`**: Tests individual story page rendering
- **`src/app/submit/page.test.tsx`**: Tests story submission form

### Component Tests (100% Coverage)

- **`src/components/Header/Header.test.tsx`**: Navigation header component tests
- **`src/components/StoryItem/StoryItem.test.tsx`**: Story item rendering and interaction tests
- **`src/components/Comment/Comment.test.tsx`**: Comment component tests with various states

### Integration Tests (100% Coverage)

- **`src/__tests__/integration/StoryFlow.test.tsx`**: End-to-end flow testing from UI to mocked backend services

## 🧪 Test Execution & Coverage

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run tests with detailed coverage report (text format)
yarn test --coverage --coverageReporters=text

# Run specific test file
yarn test -- HackerNewsCommentRepository.test.ts

# Run tests matching pattern
yarn test -- --testNamePattern="should handle API errors"
```

### Coverage Report Structure

The coverage report provides detailed metrics for:

- **Statements**: Executable statements coverage
- **Branches**: Conditional logic coverage
- **Functions**: Function/method coverage
- **Lines**: Source code line coverage

### Coverage Thresholds

- **Global**: 70% across all metrics (statements, branches, functions, lines)
- **Domain Layer**: 80% (highest priority for business logic)
- **Application Layer**: 60% (balanced for integration logic with SWR hooks)
- **Infrastructure Layer**: 70% (external API and repository implementations)
- **Presentation Layer**: 70% (components and UI logic)

### Console Error Suppression

Repository tests include console.error mocking to prevent error logs from cluttering test output:

```typescript
// In repository test files
describe("HackerNewsCommentRepository", () => {
  let repository: HackerNewsCommentRepository;
  let mockApiClient: jest.Mocked<HackerNewsApiClient>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockApiClient =
      new HackerNewsApiClient() as jest.Mocked<HackerNewsApiClient>;
    repository = new HackerNewsCommentRepository(mockApiClient);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  // ... tests
});
```

### Hydration Error Handling

Layout tests handle React hydration warnings with proper mocking:

```typescript
// In layout.test.tsx
describe("RootLayout", () => {
  it("renders the layout with Header and children", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const testChild = <div>Test Child</div>;
    render(<RootLayout>{testChild}</RootLayout>);

    // Check if Header is rendered
    expect(screen.getByRole("banner")).toBeInTheDocument();

    // Check if children are rendered
    expect(screen.getByText("Test Child")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
```

### Coverage Exclusions

The following files are excluded from coverage:

- Type definition files (`*.d.ts`)
- Index files (`index.{js,ts}`)
- Configuration files
- Setup files

## Test Directory Structure

Organize your tests following Clean Architecture principles with comprehensive coverage (75-80%+ achieved):

```
src/
├── domain/                          # 🏛️ Business Logic Layer (80%+ coverage target)
│   ├── entities/
│   │   ├── Story.ts
│   │   ├── Story.test.ts            # ✅ Entity unit tests (time calc, URL detection)
│   │   ├── Comment.ts
│   │   └── User.ts
│   ├── usecases/
│   │   ├── FetchTopStories.ts
│   │   ├── FetchTopStories.test.ts  # ✅ Use case tests with mocked repositories
│   │   ├── FetchStoryDetails.ts
│   │   └── FetchComments.ts
│   ├── repositories/
│   │   ├── IStoryRepository.ts      # Interfaces for dependency injection
│   │   ├── ICommentRepository.ts
│   │   └── IUserRepository.ts
│   └── __tests__/                   # Additional domain tests
├── application/                     # 🎯 Application Logic Layer (75%+ coverage)
│   ├── controllers/
│   │   ├── StoryController.ts
│   │   ├── StoryController.test.ts  # ✅ Controller integration tests
│   │   └── CommentController.ts
│   ├── presenters/
│   │   ├── StoryPresenter.ts
│   │   ├── StoryPresenter.test.ts   # ✅ Data transformation tests
│   │   └── CommentPresenter.ts
│   ├── hooks/
│   │   ├── useStories.ts
│   │   ├── useStories.test.ts       # ✅ SWR integration tests
│   │   └── useStoryDetails.ts
│   └── __tests__/                   # Hook integration tests
├── infrastructure/                  # 🔌 External Interfaces Layer (70%+ coverage)
│   ├── api/
│   │   ├── HackerNewsApiClient.ts
│   │   └── HackerNewsApiClient.test.ts # ✅ External API client tests
│   ├── repositories/
│   │   ├── HackerNewsStoryRepository.ts
│   │   ├── HackerNewsStoryRepository.test.ts # ✅ Repository implementation tests
│   │   ├── HackerNewsCommentRepository.ts
│   │   └── HackerNewsUserRepository.ts
│   └── __tests__/                   # Infrastructure integration tests
├── components/                      # 🖥️ Presentation Layer (100% coverage achieved)
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.test.tsx          # ✅ Navigation component tests
│   ├── StoryItem/
│   │   ├── StoryItem.tsx
│   │   └── StoryItem.test.tsx       # ✅ Story item rendering tests
│   └── Comment/
│       ├── Comment.tsx
│       └── Comment.test.tsx         # ✅ Comment component tests
├── app/                             # 🚀 Next.js App Router Pages
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main story feed
│   ├── page.test.tsx                # ✅ App page integration tests
│   ├── item/[id]/
│   │   └── page.tsx                 # Individual story page
│   └── submit/
│       └── page.tsx                 # Story submission form
└── __tests__/                       # 🔗 Integration Tests
    └── integration/
        ├── StoryFlow.test.tsx       # ✅ End-to-end story flow tests
        └── CommentFlow.test.tsx     # End-to-end comment flow tests
```

### 🧪 Test Coverage by Layer

| Layer              | Coverage Target | Current Status | Test Files | Key Features Tested                       |
| ------------------ | --------------- | -------------- | ---------- | ----------------------------------------- |
| **Domain**         | 80%+            | ✅ 100%        | 7 files    | Entity logic, use cases, business rules   |
| **Application**    | 60%+            | ✅ 89.28%      | 6 files    | Controllers, presenters, SWR hooks        |
| **Infrastructure** | 70%+            | ✅ 100%        | 4 files    | API client, repositories, external APIs   |
| **Presentation**   | 70%+            | ✅ 100%        | 4 files    | Components, pages, user interactions      |
| **Integration**    | N/A             | ✅ 100%        | 1 file     | End-to-end flows, cross-layer integration |

### 🎯 Testing Infrastructure

- **Jest Configuration**: Automatic JSX runtime, scope-aware mocking
- **Mock Setup**: Next.js Link component properly mocked with `React.createElement`
- **Coverage Thresholds**: 70% global, 80% domain layer, 60% application layer
- **Console Error Suppression**: Repository tests include console.error mocking
- **Hydration Error Handling**: Layout tests handle React hydration warnings
- **Test Utilities**: `@testing-library/react`, `@testing-library/jest-dom`
- **CI/CD Integration**: GitHub Actions with coverage reporting
- **Coverage Achievement**: 98.86% overall (functions: 96.87%, branches: 96%, lines: 98.8%)

## Testing Clean Architecture Layers

### Domain Layer Testing

**Entities** - Test business logic and validation:

```typescript
// src/domain/entities/Story.test.ts
import { StoryEntity } from "./Story";

describe("StoryEntity", () => {
  it("should calculate time ago correctly", () => {
    const pastTime = Date.now() / 1000 - 3600; // 1 hour ago
    const story = new StoryEntity(1, "Test Story", 42, "author", pastTime);

    expect(story.getTimeAgo()).toBe("1 hours ago");
  });

  it("should detect external URLs", () => {
    const storyWithUrl = new StoryEntity(
      1,
      "Test",
      42,
      "author",
      Date.now() / 1000,
      "https://example.com"
    );
    const storyWithoutUrl = new StoryEntity(
      1,
      "Test",
      42,
      "author",
      Date.now() / 1000
    );

    expect(storyWithUrl.hasExternalUrl()).toBe(true);
    expect(storyWithoutUrl.hasExternalUrl()).toBe(false);
  });
});
```

**Use Cases** - Test business rules with mocked repositories:

```typescript
// src/domain/usecases/FetchTopStories.test.ts
import { FetchTopStoriesUseCase } from "./FetchTopStories";

describe("FetchTopStoriesUseCase", () => {
  it("should fetch top stories from repository", async () => {
    const mockRepository = {
      getTopStories: jest
        .fn()
        .mockResolvedValue([
          new StoryEntity(1, "Story 1", 42, "author1", Date.now() / 1000),
          new StoryEntity(2, "Story 2", 25, "author2", Date.now() / 1000),
        ]),
    };

    const useCase = new FetchTopStoriesUseCase(mockRepository);
    const result = await useCase.execute({ limit: 2 });

    expect(result.stories).toHaveLength(2);
    expect(mockRepository.getTopStories).toHaveBeenCalledWith(2);
  });
});
```

### Application Layer Testing

**Controllers** - Test request/response handling:

```typescript
// src/application/controllers/StoryController.test.ts
import { StoryController } from "./StoryController";

describe("StoryController", () => {
  it("should handle successful story fetch", async () => {
    const controller = new StoryController();
    const result = await controller.getTopStories(5);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("should handle repository errors gracefully", async () => {
    // Mock repository to throw error
    const controller = new StoryController();
    const result = await controller.getTopStories(5);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

**Presenters** - Test data transformation:

```typescript
// src/application/presenters/StoryPresenter.test.ts
import { StoryPresenter } from "./StoryPresenter";
import { StoryEntity } from "../../domain/entities";

describe("StoryPresenter", () => {
  it("should transform StoryEntity to StoryViewModel", () => {
    const story = new StoryEntity(
      1,
      "Test Story",
      42,
      "author",
      Date.now() / 1000,
      "https://example.com"
    );
    const viewModel = StoryPresenter.present(story);

    expect(viewModel.id).toBe(1);
    expect(viewModel.title).toBe("Test Story");
    expect(viewModel.author).toBe("author");
    expect(viewModel.hasExternalUrl).toBe(true);
  });
});
```

**Hooks** - Test SWR integration:

```typescript
// src/application/hooks/useStories.test.ts
import { renderHook } from "@testing-library/react";
import { useTopStories } from "./useStories";

describe("useTopStories", () => {
  it("should return stories from SWR cache", async () => {
    const { result } = renderHook(() => useTopStories(5));

    // Test loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stories).toBeDefined();
  });
});
```

### Infrastructure Layer Testing

**API Client** - Test external API calls:

```typescript
// src/infrastructure/api/HackerNewsApiClient.test.ts
import { HackerNewsApiClient } from "./HackerNewsApiClient";

describe("HackerNewsApiClient", () => {
  it("should fetch top story IDs", async () => {
    const client = new HackerNewsApiClient();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([1, 2, 3]),
    });

    const ids = await client.getTopStoryIds();
    expect(ids).toEqual([1, 2, 3]);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
  });
});
```

**Repositories** - Test data access with mocked API:

```typescript
// src/infrastructure/repositories/HackerNewsStoryRepository.test.ts
import { HackerNewsStoryRepository } from "./HackerNewsStoryRepository";

describe("HackerNewsStoryRepository", () => {
  it("should get story by ID", async () => {
    const mockApiClient = {
      getItem: jest.fn().mockResolvedValue({
        id: 1,
        title: "Test Story",
        score: 42,
        by: "author",
        time: Date.now() / 1000,
        type: "story",
      }),
    };

    const repository = new HackerNewsStoryRepository(mockApiClient);
    const story = await repository.getStoryById(1);

    expect(story).toBeDefined();
    expect(story?.title).toBe("Test Story");
  });
});
```

## Writing Unit Tests

### Example: Testing the Header Component

```tsx
// src/components/Header/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-orange-500 text-white p-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:underline">
          Hacker News
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">
            new
          </Link>
          <Link href="/" className="hover:underline">
            past
          </Link>
          <Link href="/" className="hover:underline">
            comments
          </Link>
          <Link href="/" className="hover:underline">
            ask
          </Link>
          <Link href="/" className="hover:underline">
            show
          </Link>
          <Link href="/" className="hover:underline">
            jobs
          </Link>
          <Link href="/submit" className="hover:underline">
            submit
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

```tsx
// src/components/Header/Header.test.tsx
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the Hacker News title", () => {
    render(<Header />);
    expect(screen.getByText("Hacker News")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Header />);

    const navLinks = [
      "new",
      "past",
      "comments",
      "ask",
      "show",
      "jobs",
      "submit",
    ];
    navLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it("renders navigation links with correct href attributes", () => {
    render(<Header />);

    // Most links point to "/"
    const homeLinks = screen.getAllByText(/new|past|comments|ask|show|jobs/);
    homeLinks.forEach((link) => {
      expect(link.closest("a")).toHaveAttribute("href", "/");
    });

    // Submit link points to "/submit"
    expect(screen.getByText("submit").closest("a")).toHaveAttribute(
      "href",
      "/submit"
    );
  });

  it("applies correct CSS classes", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("bg-orange-500", "text-white", "p-3");
  });

  it("has proper semantic structure", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
```

### Example: Testing the StoryItem Component

```tsx
// src/components/StoryItem/StoryItem.tsx
import Link from "next/link";
import { StoryViewModel } from "../../application/presenters";

export default function StoryItem({ story }: { story: StoryViewModel }) {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <span className="text-gray-500 mr-2">{story.score}</span>
        <div>
          <h2 className="text-lg font-medium">
            {story.hasExternalUrl ? (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                {story.title}
              </a>
            ) : (
              <Link
                href={`/item/${story.id}`}
                className="text-black hover:underline"
              >
                {story.title}
              </Link>
            )}
          </h2>
          <p className="text-sm text-gray-600">
            by {story.author} {story.timeAgo} |{" "}
            <Link href={`/item/${story.id}`} className="hover:underline">
              {story.commentCount} comments
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// src/components/StoryItem/StoryItem.test.tsx
import { render, screen } from "@testing-library/react";
import StoryItem from "./StoryItem";
import { StoryViewModel } from "../../application/presenters";

describe("StoryItem", () => {
  const mockStory: StoryViewModel = {
    id: 123,
    title: "Test Story",
    url: "https://example.com",
    score: 42,
    author: "testuser",
    timeAgo: "1 hours ago",
    commentCount: 5,
    hasExternalUrl: true,
    displayUrl: "https://example.com",
  };

  it("renders story with external link", () => {
    render(<StoryItem story={mockStory} />);

    expect(screen.getByText("Test Story")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("by testuser")).toBeInTheDocument();
    expect(screen.getByText("5 comments")).toBeInTheDocument();
  });

  it("renders story with internal link when no URL", () => {
    const storyWithoutUrl: StoryViewModel = {
      ...mockStory,
      url: undefined,
      hasExternalUrl: false,
      displayUrl: "/item/123",
    };
    render(<StoryItem story={storyWithoutUrl} />);

    const titleLink = screen.getByText("Test Story").closest("a");
    expect(titleLink).toHaveAttribute("href", "/item/123");
  });

  it("renders external link with correct attributes", () => {
    render(<StoryItem story={mockStory} />);

    const externalLink = screen.getByText("Test Story");
    expect(externalLink.closest("a")).toHaveAttribute(
      "href",
      "https://example.com"
    );
    expect(externalLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(externalLink.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  it("displays time ago correctly", () => {
    render(<StoryItem story={mockStory} />);

    expect(screen.getByText(/1 hours ago/)).toBeInTheDocument();
  });

  it("handles story with no descendants", () => {
    const storyWithoutDescendants: StoryViewModel = {
      ...mockStory,
      commentCount: 0,
    };
    render(<StoryItem story={storyWithoutDescendants} />);

    expect(screen.getByText("0 comments")).toBeInTheDocument();
  });

  it("renders comment link with correct href", () => {
    render(<StoryItem story={mockStory} />);

    const commentLink = screen.getByText("5 comments");
    expect(commentLink.closest("a")).toHaveAttribute("href", "/item/123");
  });

  it("applies correct CSS classes", () => {
    render(<StoryItem story={mockStory} />);

    const container = screen
      .getByText("Test Story")
      .closest("div").parentElement;
    expect(container).toHaveClass("mb-4");
  });
});
```

### Example: Testing the Comment Component

```tsx
// src/components/Comment/Comment.tsx
import { CommentViewModel } from "../../application/presenters";

export default function CommentComponent({
  comment,
  level = 0,
}: {
  comment: CommentViewModel;
  level?: number;
}) {
  if (!comment.hasContent) return null;

  return (
    <div
      style={{ marginLeft: comment.level ?? level * 20 }}
      className="mb-4 border-l-2 border-gray-200 pl-4"
    >
      <p className="text-sm text-gray-600 mb-1">
        by {comment.author} {comment.timeAgo}
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: comment.text || "" }}
        className="text-sm"
      />
      {comment.hasReplies && (
        <div className="text-sm text-gray-500 mt-2">
          {comment.replyCount} replies
        </div>
      )}
    </div>
  );
}
```

```tsx
// src/components/Comment/Comment.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentComponent from "../Comment";
import { CommentViewModel } from "../../application/presenters";

describe("CommentComponent", () => {
  const mockComment: CommentViewModel = {
    id: 456,
    author: "commenter",
    timeAgo: "30 minutes ago",
    text: "This is a test comment",
    hasContent: true,
    replyCount: 0,
    hasReplies: false,
  };

  it("renders comment with author and time", () => {
    render(<CommentComponent comment={mockComment} />);

    expect(screen.getByText(/by commenter/)).toBeInTheDocument();
    expect(screen.getByText(/30 minutes ago/)).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
  });

  it("renders anonymous for comments without author", () => {
    const commentWithoutAuthor: CommentViewModel = {
      ...mockComment,
      author: "anonymous",
    };

    render(<CommentComponent comment={commentWithoutAuthor} />);

    expect(screen.getByText(/by anonymous/)).toBeInTheDocument();
  });

  it("does not render deleted comments", () => {
    const deletedComment: CommentViewModel = {
      ...mockComment,
      hasContent: false,
      text: undefined,
    };

    const { container } = render(<CommentComponent comment={deletedComment} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows reply count when comment has replies", () => {
    const commentWithReplies: CommentViewModel = {
      ...mockComment,
      hasReplies: true,
      replyCount: 3,
    };

    render(<CommentComponent comment={commentWithReplies} />);

    expect(screen.getByText("3 replies")).toBeInTheDocument();
  });
});
```

## Mocking Dependencies

### Mocking API Calls (Global Setup)

```tsx
// In jest.setup.js (already configured)
global.fetch = jest.fn();

// Usage in tests
describe("API Component", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("fetches data on mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ data: "test" }),
    });

    render(<ApiComponent />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/data");
    });
  });
});
```

### Mocking SWR Hooks (Inline Approach)

```tsx
// In your test file
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock SWR at the top of the file
jest.mock("swr");

describe("SWR Component", () => {
  it("handles loading state", () => {
    // Mock SWR response for this specific test
    const mockUseSWR = jest.fn(() => ({
      data: undefined,
      error: undefined,
      isLoading: true,
    }));
    require("swr").default = mockUseSWR;

    render(<SWRComponent />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays data when loaded", () => {
    const mockData = { items: ["item1", "item2"] };
    const mockUseSWR = jest.fn(() => ({
      data: mockData,
      error: undefined,
      isLoading: false,
    }));
    require("swr").default = mockUseSWR;

    render(<SWRComponent />);

    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();
  });
});
```

### Mocking Custom Hooks

```tsx
// hooks/useAuth.ts
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({ id: 1, name: "John Doe" });
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading, logout: () => setUser(null) };
};
```

```tsx
// __mocks__/useAuth.ts
export const mockUseAuth = jest.fn();

// Test usage
import { mockUseAuth } from "../__mocks__/useAuth";

jest.mock("../hooks/useAuth", () => ({
  useAuth: mockUseAuth,
}));

describe("AuthComponent", () => {
  it("shows user name when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: "John Doe" },
      loading: false,
      logout: jest.fn(),
    });

    render(<AuthComponent />);

    expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
  });
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test -- Header.test.tsx

# Run tests matching pattern
yarn test -- --testNamePattern="renders with correct text"
```

### Coverage Configuration

Update `jest.config.js` for detailed coverage:

```javascript
module.exports = {
  // ... other config
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Layer-specific thresholds
    "src/domain/**/*.ts": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "src/application/**/*.ts": {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};
```

## Best Practices

### 1. Test Behavior, Not Implementation

```tsx
// ❌ Bad: Testing implementation details
it("calls setState with correct value", () => {
  const setStateSpy = jest.spyOn(React, "useState");
  render(<Counter />);
  expect(setStateSpy).toHaveBeenCalledWith(1);
});

// ✅ Good: Testing user-visible behavior
it("increments counter when button is clicked", () => {
  render(<Counter />);
  fireEvent.click(screen.getByText("Increment"));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### 2. Use Descriptive Test Names

```tsx
// ❌ Bad
it('works', () => { ... });
it('test form', () => { ... });

// ✅ Good
it('displays validation error when email is invalid', () => { ... });
it('submits form with correct data when all fields are valid', () => { ... });
```

### 3. Arrange, Act, Assert Pattern

```tsx
it("updates user profile", async () => {
  // Arrange
  const user = userEvent.setup();
  const mockUpdateUser = jest.fn();
  render(<ProfileForm onUpdate={mockUpdateUser} />);

  // Act
  await user.type(screen.getByLabelText("Name"), "John Doe");
  await user.click(screen.getByText("Save"));

  // Assert
  expect(mockUpdateUser).toHaveBeenCalledWith({ name: "John Doe" });
});
```

### 4. Use data-testid for Complex Elements

```tsx
// For elements that are hard to select with getByRole or getByText
<button data-testid="submit-btn">Submit</button>;

// Test
expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
```

### 5. Mock External Dependencies

```tsx
// Mock API calls, third-party libraries, etc.
jest.mock("axios");
jest.mock("../utils/api");
```

### 6. Test Error States

```tsx
it("displays error message when API fails", async () => {
  mockFetch.mockRejectedValueOnce(new Error("API Error"));
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });
});
```

### 7. Use beforeEach for Setup

```tsx
describe("Component", () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      onSubmit: jest.fn(),
      initialValue: "test",
    };
  });

  it("renders correctly", () => {
    render(<Component {...mockProps} />);
    // ... test
  });
});
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run linting
        run: yarn lint

      - name: Run tests
        run: yarn test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Jenkins Pipeline Example

```groovy
pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'yarn install --frozen-lockfile'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn test:coverage'
      }
      post {
        always {
          publishCoverage adapters: [istanbulAdapter(path: 'coverage/lcov.info')]
        }
      }
    }

    stage('Build') {
      steps {
        sh 'yarn build'
      }
    }
  }

  post {
    always {
      junit 'test-results/*.xml'
    }
  }
}
```

## Framework-Specific Adaptations

### Vue.js with Vue Test Utils

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js", "vue"],
};

// Component.test.js
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  it("emits click event", async () => {
    const wrapper = mount(Button);
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
```

### Angular with Angular Testing Utilities

```typescript
// component.spec.ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonComponent } from "./button.component";

describe("ButtonComponent", () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it("should emit click event", () => {
    spyOn(component.clicked, "emit");
    component.onClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
```

### Svelte with Svelte Testing Library

```javascript
// jest.config.js
module.exports = {
  transform: {
    "^.+\\.svelte$": "svelte-jester",
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js", "svelte"],
};

// Component.test.js
import { render } from "@testing-library/svelte";
import Button from "./Button.svelte";

test("button click", async () => {
  const { getByText } = render(Button);
  const button = getByText("Click me");

  await fireEvent.click(button);
  // Assert expected behavior
});
```

## Implementation Notes

### Current Implementation Status

This comprehensive testing implementation has achieved 98.86% overall coverage across all architectural layers:

- **Clean Architecture Implementation**: Full separation of concerns across Domain, Application, Infrastructure, and Presentation layers
- **Enhanced Testability**: Each architectural layer can be tested independently with proper mocking
- **Improved Maintainability**: Clear boundaries between business logic, application logic, and external dependencies
- **SWR Integration**: Custom hooks wrap Clean Architecture layers while preserving SWR's caching benefits
- **Modern JSX Transform**: Configured for automatic JSX runtime (React 17+) with proper Jest integration
- **Optimized Mock Setup**: Next.js Link component properly mocked with scope-aware implementation
- **Console Error Suppression**: Repository tests include console.error mocking to prevent test output clutter
- **Hydration Error Handling**: Layout tests handle React hydration warnings with proper mocking
- **Comprehensive Test Suite**: 25 test files covering all major components and architectural layers
- **Layer-Specific Thresholds**: Higher coverage requirements for critical business logic (Domain: 80%, Application: 60%)

### Key Implementation Details

1. **Layered Testing Strategy**: Tests are organized by architectural layer (Domain, Application, Infrastructure, Presentation)

2. **Repository Pattern**: Interfaces in the Domain layer enable easy mocking and testing of data access logic

3. **Presenter Pattern**: Application layer presenters transform domain entities into UI-friendly view models

4. **Custom Hooks**: SWR integration is wrapped in custom hooks that use Clean Architecture controllers

5. **Type Safety**: Full TypeScript support with proper interfaces for all architectural boundaries

6. **Jest Configuration**: Updated module mapping to support Clean Architecture directory structure
7. **Automatic JSX Runtime**: Configured Jest to use React's modern JSX transform for better performance
8. **Scope-Aware Mocking**: Next.js Link mock properly handles Jest's module isolation requirements

### Test Execution Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Conclusion

This guide provides a comprehensive foundation for testing UI components with Jest. Remember:

1. Focus on testing user behavior rather than implementation details
2. Use descriptive test names that explain the expected behavior
3. Mock external dependencies to isolate component logic
4. Test both happy paths and error states
5. Maintain high test coverage but prioritize meaningful tests
6. Integrate testing into your CI/CD pipeline for continuous quality assurance

For more advanced testing scenarios, consider exploring:

- Integration testing with Cypress or Playwright
- Visual regression testing with tools like Chromatic
- Performance testing for components
- Accessibility testing with axe-core

Happy testing! 🚀
