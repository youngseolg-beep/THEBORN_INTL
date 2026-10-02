import { getHomeV2Chapter, type HomeV2ChapterId } from "./homeV2Chapters";

export default function ChapterHeader({ chapter, id, as: Tag = "h2", className = "" }: {
  chapter: HomeV2ChapterId;
  id?: string;
  as?: "h2" | "p";
  className?: string;
}) {
  const { number, title } = getHomeV2Chapter(chapter);
  return (
    <Tag id={id} className={`chapter-header ${className}`} data-chapter-header={chapter}>
      <span className="chapter-header-number">{number}</span>
      <span className="chapter-header-slash" aria-hidden="true"> / </span>
      <span>{title}</span>
    </Tag>
  );
}
