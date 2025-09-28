import * as React from 'react'

import {
  Toast as ToastItem,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  ToastProvider as PrimitiveToastProvider,
  type ToastVariant,
} from './toast'

type ToastActionConfig = {
  label: string
  onClick?: () => void
  altText?: string
}

type ToastOptions = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  duration?: number
  action?: ToastActionConfig
}

type StoredToast = ToastOptions & { id: string }

type ToastContextValue = {
  toast: (options: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<StoredToast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = React.useCallback((options: ToastOptions) => {
    const id = options.id ?? generateId()

    setToasts((current) => {
      const withoutExisting = current.filter((toast) => toast.id !== id)
      return [...withoutExisting, { ...options, id }]
    })

    return id
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <PrimitiveToastProvider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map(({ id, title, description, variant, duration, action }) => (
          <ToastItem
            key={id}
            variant={variant}
            duration={duration}
            open
            onOpenChange={(open) => {
              if (!open) {
                dismiss(id)
              }
            }}
          >
            <div className="flex flex-col gap-1 pr-6">
              {title ? <ToastTitle>{title}</ToastTitle> : null}
              {description ? <ToastDescription>{description}</ToastDescription> : null}
            </div>
            {action ? (
              <ToastAction
                altText={action.altText ?? 'Perform action'}
                onClick={() => {
                  action.onClick?.()
                  dismiss(id)
                }}
              >
                {action.label}
              </ToastAction>
            ) : null}
            <ToastClose />
          </ToastItem>
        ))}
        <ToastViewport />
      </PrimitiveToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
