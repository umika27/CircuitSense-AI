"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadCard({
  file,
  previewUrl,
  onFileChange,
}: {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileChange(acceptedFiles[0] ?? null);
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 transition",
          isDragActive && "border-sky-300 bg-sky-400/10",
        )}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Uploaded circuit preview"
              fill
              className="object-contain p-4"
              unoptimized
            />
            <button
              type="button"
              aria-label="Remove uploaded image"
              onClick={(event) => {
                event.stopPropagation();
                onFileChange(null);
              }}
              className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/60 p-2 text-white transition hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-slate-200">
              {file?.name}
            </div>
          </>
        ) : (
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-5 rounded-2xl border border-sky-300/25 bg-sky-300/10 p-4 text-sky-200">
              <ImagePlus className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-white">Drop a circuit schematic</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Upload a breadboard photo, textbook schematic, or hand-drawn diagram.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
