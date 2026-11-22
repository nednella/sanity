import { Dialog, DialogContent, DialogTitle } from "@/lib/ui/dialog";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

type MediaDialogProps = {
  alt: string;
  onClose: () => void;
  src: string | null;
};

export function MediaDialog({ alt, onClose, src }: Readonly<MediaDialogProps>) {
  function handleOpenChange(open: boolean) {
    if (!open) onClose();
  }

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={src !== null}
    >
      <DialogContent
        className="
          p-2
          sm:max-w-4xl
        "
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        {src &&
          (isVideo(src) ? (
            <video
              className="max-h-[80vh] w-full"
              controls
              src={src}
            >
              <track kind="captions" />
            </video>
          ) : (
            <img
              alt={alt}
              className="max-h-[80vh] w-full object-contain"
              src={src}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
}

function isVideo(source: string) {
  return VIDEO_EXTENSIONS.some((extension) => new URL(source).pathname.endsWith(extension));
}
