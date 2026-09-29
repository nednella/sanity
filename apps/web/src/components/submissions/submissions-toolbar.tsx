import { ContentFilter, type ContentSelection } from "@/components/submissions/content-filter";
import { SubmissionTypeToggle } from "@/components/submissions/submission-type-toggle";
import type { SubmissionType, SubmissionsSearch } from "@/lib/submissions/search";

type SubmissionsToolbarProps = {
  onChange: (search: Partial<SubmissionsSearch>) => void;
  search: SubmissionsSearch;
};

export function SubmissionsToolbar({ onChange, search }: Readonly<SubmissionsToolbarProps>) {
  const switchTo = (type: SubmissionType) => onChange({ limit: search.limit, offset: 0, type });
  const filterBy = (selection: ContentSelection) => onChange({ ...search, ...selection, offset: 0 });

  return (
    <>
      <SubmissionTypeToggle
        type={search.type}
        onChange={switchTo}
      />

      {search.type === "personalBests" && (
        <ContentFilter
          contentId={search.contentId}
          scale={search.scale}
          onChange={filterBy}
        />
      )}
    </>
  );
}
