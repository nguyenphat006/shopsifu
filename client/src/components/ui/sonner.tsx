"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: 'group-[.toast]:bg-red-50 group-[.toast]:text-red-600 dark:group-[.toast]:bg-red-950 dark:group-[.toast]:text-red-200 group-[.toast]:border-red-200 dark:group-[.toast]:border-red-800',
          success: 'group-[.toast]:bg-green-50 group-[.toast]:text-green-600 dark:group-[.toast]:bg-green-950 dark:group-[.toast]:text-green-200 group-[.toast]:border-green-200 dark:group-[.toast]:border-green-800',
          warning: 'group-[.toast]:bg-yellow-50 group-[.toast]:text-yellow-600 dark:group-[.toast]:bg-yellow-950 dark:group-[.toast]:text-yellow-200 group-[.toast]:border-yellow-200 dark:group-[.toast]:border-yellow-800',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
