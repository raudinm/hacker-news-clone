import { render, screen, fireEvent } from "@testing-library/react";
import SubmitPage from "./page";

// Mock console.log and alert
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockAlert = jest.spyOn(window, "alert").mockImplementation();

describe("SubmitPage", () => {
  beforeEach(() => {
    // Mock console.log and window.alert before each test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore mocks after each test
    jest.restoreAllMocks();
  });

  it("renders the submit form", () => {
    render(<SubmitPage />);

    expect(screen.getByRole("heading", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByLabelText("Title:")).toBeInTheDocument();
    expect(screen.getByLabelText("URL:")).toBeInTheDocument();
    expect(screen.getByLabelText("Text:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("updates title input value", () => {
    render(<SubmitPage />);

    const titleInput = screen.getByLabelText("Title:");
    fireEvent.change(titleInput, { target: { value: "Test Title" } });

    expect(titleInput).toHaveValue("Test Title");
  });

  it("updates URL input value", () => {
    render(<SubmitPage />);

    const urlInput = screen.getByLabelText("URL:");
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    expect(urlInput).toHaveValue("https://example.com");
  });

  it("updates text textarea value", () => {
    render(<SubmitPage />);

    const textTextarea = screen.getByLabelText("Text:");
    fireEvent.change(textTextarea, { target: { value: "Test text content" } });

    expect(textTextarea).toHaveValue("Test text content");
  });

  it("submits the form with all fields filled", () => {
    render(<SubmitPage />);

    const titleInput = screen.getByLabelText("Title:");
    const urlInput = screen.getByLabelText("URL:");
    const textTextarea = screen.getByLabelText("Text:");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.change(textTextarea, { target: { value: "Test text content" } });
    fireEvent.click(submitButton);

    expect(console.log).toHaveBeenCalledWith("Submitted:", {
      title: "Test Title",
      url: "https://example.com",
      text: "Test text content",
    });
    expect(window.alert).toHaveBeenCalledWith(
      "Story submitted! (This is a demo, not actually submitted to Hacker News)"
    );

    // Check if form is reset
    expect(titleInput).toHaveValue("");
    expect(urlInput).toHaveValue("");
    expect(textTextarea).toHaveValue("");
  });

  it("submits the form with only title and text", () => {
    render(<SubmitPage />);

    const titleInput = screen.getByLabelText("Title:");
    const textTextarea = screen.getByLabelText("Text:");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(textTextarea, { target: { value: "Test text content" } });
    fireEvent.click(submitButton);

    expect(console.log).toHaveBeenCalledWith("Submitted:", {
      title: "Test Title",
      url: "",
      text: "Test text content",
    });
    expect(window.alert).toHaveBeenCalledWith(
      "Story submitted! (This is a demo, not actually submitted to Hacker News)"
    );
  });

  it("prevents form submission when title is empty", () => {
    render(<SubmitPage />);

    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.click(submitButton);

    expect(console.log).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });
});
