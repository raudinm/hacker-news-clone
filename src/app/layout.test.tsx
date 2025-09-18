import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";

// Mock CSS import
jest.mock("./globals.css", () => ({}));

describe("RootLayout", () => {
  it("renders the layout with Header and children", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const testChild = <div>Test Child</div>;

    render(<RootLayout>{testChild}</RootLayout>);

    // Check if Header is rendered
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Assuming Header has a banner role

    // Check if children are rendered
    expect(screen.getByText("Test Child")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("exports metadata correctly", () => {
    const { metadata } = require("./layout");
    expect(metadata).toEqual({
      title: "Hacker News Clone",
      description: "A clone of Hacker News built with Next.js",
    });
  });
});
