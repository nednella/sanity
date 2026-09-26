import { useEffect, useRef } from "react";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

const isVideo = (source: string) => VIDEO_EXTENSIONS.some((extension) => new URL(source).pathname.endsWith(extension));

type MediaDialogProps = {
  alt: string;
  onClose: () => void;
  src: string | null;
};

export function MediaDialog({ alt, onClose, src }: Readonly<MediaDialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (src) dialog.showModal();
    else dialog.close();
  }, [src]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box max-w-4xl rounded-xs border border-base-300 bg-base-100 p-2">
        {src &&
          (isVideo(src) ? (
            <video
              src={src}
              controls
              className="max-h-[80vh] w-full"
            >
              <track kind="captions" />
            </video>
          ) : (
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] w-full object-contain"
            />
          ))}
      </div>
      <form
        method="dialog"
        className="modal-backdrop"
      >
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
}
