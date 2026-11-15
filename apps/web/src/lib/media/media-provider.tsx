import { useMediaStore } from "@/lib/media/media.store";
import { MediaDialog } from "@/lib/ui/media-dialog";

/**
 * This provider should be nested within the provider tree next to the
 * application's entry point.
 */
export function MediaProvider() {
  const { media, closeMedia } = useMediaStore();

  return (
    <MediaDialog
      alt={media?.alt ?? ""}
      onClose={closeMedia}
      src={media?.src ?? null}
    />
  );
}
