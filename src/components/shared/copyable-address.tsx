"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { truncateMiddle } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

interface CopyableAddressProps {
  value: string
  href?: string
  prefixLen?: number
  suffixLen?: number
  className?: string
}

export function CopyableAddress({
  value,
  href,
  prefixLen = 6,
  suffixLen = 6,
  className,
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  const content = (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-sm", className)}>
      {truncateMiddle(value, prefixLen, suffixLen)}
      <Button
        variant="ghost"
        size="icon"
        className="size-5 shrink-0"
        onClick={handleCopy}
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="size-3 text-emerald-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
    </span>
  )

  if (href) {
    return (
      <a href={href} className="underline-offset-4 hover:underline">
        {content}
      </a>
    )
  }

  return content
}
