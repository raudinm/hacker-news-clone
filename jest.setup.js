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
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Global test utilities
global.fetch = jest.fn();
