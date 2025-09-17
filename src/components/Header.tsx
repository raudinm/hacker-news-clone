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
