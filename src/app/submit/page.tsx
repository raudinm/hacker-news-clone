"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since we can't actually submit to HN, just log it
    console.log("Submitted:", { title, url, text });
    alert(
      "Story submitted! (This is a demo, not actually submitted to Hacker News)"
    );
    setTitle("");
    setUrl("");
    setText("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Submit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL:
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-1">
            Text:
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded"
            rows={6}
            placeholder="Or submit text instead of a URL"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
