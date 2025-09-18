import Link from "next/link";
import { StoryViewModel } from "../application/presenters";

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
