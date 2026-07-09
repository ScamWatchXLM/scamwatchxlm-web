"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Coins, FileWarning, Building2, User, ArrowLeftRight } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useUiStore } from "@/stores/ui-store"
import { useGlobalSearch } from "@/hooks/use-search"
import { primaryNav } from "@/config/site"
import type { EntityKind } from "@/types/domain"

const KIND_ICON: Record<
  EntityKind | "report",
  React.ComponentType<{ className?: string }>
> = {
  account: User,
  asset: Coins,
  issuer: Building2,
  transaction: ArrowLeftRight,
  report: FileWarning,
}

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen)
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { data: results, isFetching } = useGlobalSearch(query)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, setOpen])

  function go(href: string) {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search ScamWatchXLM"
      description="Search accounts, assets, issuers, transactions, and reports"
    >
      <CommandInput
        placeholder="Search accounts, assets, issuers, tx hashes, reports…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!query && (
          <CommandGroup heading="Navigate">
            {primaryNav.map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon className="size-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {query && !isFetching && !results?.length && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {results && results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result) => {
              const Icon = KIND_ICON[result.kind]
              return (
                <CommandItem
                  key={`${result.kind}-${result.id}`}
                  onSelect={() => go(result.href)}
                >
                  <Icon className="size-4" />
                  <div className="flex flex-col">
                    <span>{result.label}</span>
                    <span className="text-muted-foreground text-xs capitalize">
                      {result.subtitle}
                    </span>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
