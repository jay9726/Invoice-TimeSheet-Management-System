import { toast } from "sonner"

interface ActionOption {
  actionLabel?: string;
  action?: () => void;
}

export const useToast = () => {
  const base = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description?: string,
    action?: ActionOption
  ) => {

    const colorMap: Record<typeof type, string> = {
      success: "!bg-green-100 !text-green-700 !border-green-300",
      error: "!bg-red-100 !text-red-700 !border-red-300",
      warning: "!bg-yellow-100 !text-yellow-700 !border-yellow-300",
      info: "!bg-blue-100 !text-blue-700 !border-blue-300",
    }

    toast[type](title, {
      description,
      classNames: {
        toast: `border ${colorMap[type]}`,
        title: "!text-inherit",
        description: "!text-inherit",
      },
      action: action?.actionLabel
        ? {
            label: action.actionLabel,
            onClick: action.action!,
          }
        : undefined,
    })
  }

  const success = (title: string, description?: string, action?: ActionOption) =>
    base("success", title, description, action)

  const error = (title: string, description?: string, action?: ActionOption) =>
    base("error", title, description, action)

  const info = (title: string, description?: string, action?: ActionOption) =>
    base("info", title, description, action)

  const warning = (title: string, description?: string, action?: ActionOption) =>
    base("warning", title, description, action)

  return { success, error, info, warning }
}