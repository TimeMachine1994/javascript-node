import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button variants using class-variance-authority
 * This defines all the possible variants and sizes for the button component
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gold: "bg-[#D5BA7F] text-black hover:shadow-[0_0_10px_4px_#D5BA7F] hover:text-black transition-all duration-300 ease-in-out" // Custom gold variant for the tribute theme
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md text-lg",
        icon: "h-10 w-10 p-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

/**
 * Type definition for button variant props
 */
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;