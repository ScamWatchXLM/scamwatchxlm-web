"use client"

import { useRef } from "react"
import { File, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EvidenceUploadProps {
  fileNames: string[]
  onChange: (fileNames: string[]) => void
  maxFiles?: number
}

/**
 * Placeholder evidence upload — captures file names only, nothing is sent
 * anywhere. Wire this up to real object storage (S3/R2 presigned URLs) once
 * the backend exists; the `fileNames` contract can stay the same.
 */
export function EvidenceUpload({
  fileNames,
  onChange,
  maxFiles = 5,
}: EvidenceUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    const next = Array.from(new Set([...fileNames, ...names])).slice(0, maxFiles)
    onChange(next)
  }

  function removeFile(name: string) {
    onChange(fileNames.filter((f) => f !== name))
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors"
        )}
      >
        <UploadCloud className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">Drag & drop screenshots or evidence files</p>
        <p className="text-muted-foreground text-xs">
          PNG, JPG, PDF up to 10MB · {fileNames.length}/{maxFiles} attached
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
        >
          Browse files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {fileNames.length > 0 && (
        <ul className="space-y-1.5">
          {fileNames.map((name) => (
            <li
              key={name}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                <File className="text-muted-foreground size-4 shrink-0" />
                <span className="truncate">{name}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                onClick={() => removeFile(name)}
              >
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
