import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean
};

interface AnimatedFormProps {
  children: React.ReactNode
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function AnimatedForm({ children, className }: AnimatedFormProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn('flex flex-col gap-6', className)}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedFormItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ children, className, ...props }: ButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      variants={itemVariants}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
} 