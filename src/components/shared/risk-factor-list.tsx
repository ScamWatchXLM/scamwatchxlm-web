import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RiskMeter } from "@/components/shared/risk-meter"
import { formatDate } from "@/lib/utils/format"
import type { RiskScore } from "@/types/domain"

export function RiskFactorList({ riskScore }: { riskScore: RiskScore }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Score</CardTitle>
        <CardDescription>Last updated {formatDate(riskScore.updatedAt)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskMeter value={riskScore.value} />
        <div className="space-y-3">
          {riskScore.factors.map((factor) => (
            <div key={factor.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{factor.label}</span>
                <span className="text-muted-foreground">+{factor.weight}</span>
              </div>
              <p className="text-muted-foreground text-xs">{factor.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
