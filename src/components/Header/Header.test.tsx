import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../Header";

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
    homeLinks.forEach((link: HTMLElement) => {
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
