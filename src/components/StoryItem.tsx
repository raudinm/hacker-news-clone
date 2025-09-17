import Link from "next/link";

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

export default function StoryItem({ story }: { story: Story }) {
  const timeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return `${minutes} minutes ago`;
  };

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <span className="text-gray-500 mr-2">{story.score}</span>
        <div>
          <h2 className="text-lg font-medium">
            {story.url ? (
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
            by {story.by} {timeAgo(story.time)} |{" "}
            <Link href={`/item/${story.id}`} className="hover:underline">
              {story.descendants || 0} comments
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
