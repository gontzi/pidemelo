import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Panel de contenido. En "Community-first" la interfaz es predominantemente
// blanca; los tonos de color se usan como acentos sutiles, no como bloques.
const panelVariants = cva("rounded-xl border", {
  variants: {
    tone: {
      cream: "bg-card border-border",
      card: "bg-card border-border",
      butter: "bg-muted/60 border-border",
      muted: "bg-muted/60 border-border",
      coral: "bg-[#FDECEB] border-[#F6D2CF]",
      sage: "bg-mint border-[#CDE9DA]",
      mint: "bg-mint border-[#CDE9DA]",
      sky: "bg-[#FFF0E8] border-[#FFD9C2]",
      blue: "bg-[#FFF0E8] border-[#FFD9C2]",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-6 md:p-8",
    },
  },
  defaultVariants: {
    tone: "cream",
    padding: "md",
  },
})

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, tone, padding, ...props }, ref) => (
    <div ref={ref} className={cn(panelVariants({ tone, padding }), className)} {...props} />
  )
)
Panel.displayName = "Panel"

export { Panel, panelVariants }
