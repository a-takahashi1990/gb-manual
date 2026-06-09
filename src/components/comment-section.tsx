import { MessageSquare } from "lucide-react";
import { createComment, deleteComment } from "@/lib/actions/comments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/submit-button";
import { DeleteButton } from "@/components/delete-button";
import { formatDateTime } from "@/lib/format";

type CommentItem = {
  id: string;
  content: string;
  createdAt: Date;
  userName: string;
  userId: string;
};

export function CommentSection({
  projectId,
  comments,
  currentUserId,
  isAdmin,
}: {
  projectId: string;
  comments: CommentItem[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="size-4" />
          コメント
          <span className="text-sm font-normal text-muted-foreground">
            ({comments.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 投稿フォーム */}
        <form action={createComment} className="space-y-2">
          <input type="hidden" name="projectId" value={projectId} />
          <Textarea
            name="content"
            placeholder="コメントを入力..."
            rows={3}
            required
          />
          <div className="flex justify-end">
            <SubmitButton size="sm">投稿する</SubmitButton>
          </div>
        </form>

        {/* 一覧 */}
        {comments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            まだコメントはありません。
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => {
              const canDelete = c.userId === currentUserId || isAdmin;
              return (
                <li key={c.id} className="flex gap-3">
                  <Avatar name={c.userName} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                      {c.content}
                    </p>
                  </div>
                  {canDelete && (
                    <form action={deleteComment} className="flex-shrink-0">
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="projectId" value={projectId} />
                      <DeleteButton
                        variant="ghost"
                        size="icon"
                        iconOnly
                        confirmMessage="このコメントを削除しますか？"
                      />
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
