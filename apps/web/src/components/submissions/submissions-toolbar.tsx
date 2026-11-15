import { ContentFilter, type ContentSelection } from "@/components/submissions/content-filter";
import { SubmissionTypeToggle } from "@/components/submissions/submission-type-toggle";
import type { SubmissionType, SubmissionsSearch } from "@/lib/submissions/search";

type SubmissionsToolbarProps = {
  onChange: (search: Partial<SubmissionsSearch>) => void;
  search: SubmissionsSearch;
};

export function SubmissionsToolbar({ onChange, search }: Readonly<SubmissionsToolbarProps>) {
  function switchTo(type: SubmissionType) {
    return onChange({ limit: search.limit, offset: 0, type });
  }
  function filterBy(selection: ContentSelection) {
    return onChange({ ...search, ...selection, offset: 0 });
  }

  return (
    <>
      <SubmissionTypeToggle
        onChange={switchTo}
        type={search.type}
      />

      {search.type === "personalBests" && (
        <ContentFilter
          contentId={search.contentId}
          onChange={filterBy}
          scale={search.scale}
        />
      )}
    </>
  );
}
