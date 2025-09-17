# Hacker News Clone

A modern, responsive clone of Hacker News built with Next.js, TypeScript, and Tailwind CSS. This project fetches real-time data from the Hacker News API and provides a familiar interface for browsing stories, comments, and submitting new content.

## 🚀 Features

- **Real-time Story Feed**: Displays the top 30 stories from Hacker News with automatic updates
- **Individual Story Pages**: Detailed view with full story content and nested comments
- **Recursive Comment System**: Threaded comments with proper indentation and replies
- **Advanced Data Fetching**: SWR-powered caching and revalidation for optimal performance
- **Submit Stories**: Form to submit new stories (demo functionality)
- **Responsive Design**: Mobile-friendly layout mimicking the original Hacker News
- **Fast Navigation**: Client-side routing for smooth user experience
- **HN-like Styling**: Orange header, clean typography, and familiar UI elements
- **Smart Caching**: Automatic data caching with background revalidation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR (for caching and revalidation)
- **API**: Hacker News Firebase API
- **Font**: Arial (matching original HN)

## 📦 Installation

1. Clone the repository:

```bash
git clone git@github.com:raudinm/hacker-news-clone.git
cd hacker-news-clone
```

2. Install dependencies (using Yarn):

```bash
yarn install
```

> **Note**: This project uses Yarn as the package manager. Make sure you have Yarn installed globally.

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with header
│   ├── page.tsx            # Main story feed
│   ├── item/[id]/
│   │   └── page.tsx        # Individual story page
│   └── submit/
│       └── page.tsx        # Submit story form
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── StoryItem.tsx       # Story list item component
│   └── Comment.tsx         # Recursive comment component
└── globals.css             # Global styles
```

## 🔧 Usage

### Browsing Stories

- Visit the homepage to see the top stories
- Click on any story title to view details and comments
- Use the header navigation (currently links to home for demo)

### Viewing Comments

- Comments are displayed with proper nesting
- Click on story links to navigate to external sites
- Time stamps show relative time (e.g., "2 hours ago")

### Submitting Stories

- Navigate to `/submit` to access the submission form
- Fill in title, URL, or text content
- Submit button logs the data (demo - doesn't actually post to HN)

## 🌐 API Integration

The app uses the official Hacker News Firebase API:

- **Top Stories**: `https://hacker-news.firebaseio.com/v0/topstories.json`
- **Story Details**: `https://hacker-news.firebaseio.com/v0/item/{id}.json`
- **Comments**: Fetched recursively using the same item endpoint

## ⚡ Data Fetching with SWR

This project uses SWR (stale-while-revalidate) for efficient data fetching and caching:

### Key Benefits:

- **Automatic Caching**: API responses are cached to reduce redundant requests
- **Background Revalidation**: Data updates automatically in the background
- **Error Handling**: Built-in retry logic and error recovery
- **Loading States**: Smooth loading indicators for better UX
- **Request Deduplication**: Identical requests are automatically deduplicated
- **Focus Revalidation**: Data refreshes when user returns to the tab

### Configuration:

- **Stories**: Refresh every 5 minutes with focus/reconnect revalidation
- **Comments**: Cached with background updates for nested replies
- **Error Recovery**: Automatic retry on failed requests

## 🎨 Styling

- **Header**: Orange background (#ff6600) with white text
- **Typography**: Arial font family for authenticity
- **Layout**: Max-width container with responsive padding
- **Links**: Standard blue links with hover effects
- **Comments**: Indented threads with gray borders

## 🚀 Deployment

### Vercel (Recommended)

```bash
yarn build
yarn start
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is for educational purposes and is not affiliated with Hacker News or Y Combinator.

## 🔗 Links

- [Original Hacker News](https://news.ycombinator.com/)
- [Hacker News API Documentation](https://github.com/HackerNews/API)
- [Next.js Documentation](https://nextjs.org/docs)
