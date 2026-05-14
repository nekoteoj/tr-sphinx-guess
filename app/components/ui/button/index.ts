import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border-2 border-border shadow-[var(--shadow-brutal-sm)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:-translate-x-px hover:-translate-y-px hover:shadow-[var(--shadow-brutal)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "bg-card text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "bg-transparent text-foreground",
        link: "text-primary underline-offset-4 hover:underline border-transparent bg-transparent shadow-none hover:shadow-none active:shadow-none hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
