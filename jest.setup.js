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
