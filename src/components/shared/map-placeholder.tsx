import { Globe2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

/**
 * Placeholder for a future geographic activity map (e.g. flagged-account
 * origin heuristics via IP/validator geolocation). Swap this out for a real
 * map library (react-simple-maps, deck.gl, mapbox-gl) once that data source
 * exists — the surrounding Card/CardHeader keeps the dashboard grid stable.
 */
export function MapPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Activity Map</CardTitle>
        <CardDescription>
          Geographic distribution of flagged activity — coming soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-[radial-gradient(circle_at_center,_var(--color-muted)_0%,_transparent_70%)]">
          <div className="flex flex-col items-center gap-2 text-center">
            <Globe2 className="text-muted-foreground size-10" strokeWidth={1.25} />
            <p className="text-sm font-medium">Map integration pending</p>
            <p className="text-muted-foreground max-w-xs text-xs">
              This panel is an extensibility point for a future geo-distribution
              visualization of flagged network activity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
