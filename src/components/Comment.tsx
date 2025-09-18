import { CommentViewModel } from "../application/presenters";

export default function CommentComponent({
  comment,
  level = 0,
}: {
  comment: CommentViewModel;
  level?: number;
}) {
  // For now, we'll handle replies at the page level
  // In a more complete implementation, we could pass replies as props
  const currentLevel = comment.level ?? level;

  if (!comment.hasContent) return null;

  return (
    <div
      style={{ marginLeft: currentLevel * 20 }}
      className="mb-4 border-l-2 border-gray-200 pl-4"
    >
      <p className="text-sm text-gray-600 mb-1">
        by {comment.author} {comment.timeAgo}
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: comment.text || "" }}
        className="text-sm"
      />
      {comment.hasReplies && (
        <div className="text-sm text-gray-500 mt-2">
          {comment.replyCount} replies
        </div>
      )}
    </div>
  );
}
