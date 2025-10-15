"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms
};

type ToastContextType = {
  show: (message: string, options?: { type?: ToastType; duration?: number }) => string;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((message: string, options?: { type?: ToastType; duration?: number }) => {
    const id = `t_${++idRef.current}`;
    const toast: Toast = {
      id,
      message,
      type: options?.type || "info",
      duration: options?.duration ?? 3500,
    };
    setToasts((t) => [...t, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => dismiss(id), toast.duration);
    }
    return id;
  }, [dismiss]);

  const api = useMemo<ToastContextType>(() => ({
    show,
    success: (m, d) => show(m, { type: "success", duration: d }),
    error: (m, d) => show(m, { type: "error", duration: d }),
    info: (m, d) => show(m, { type: "info", duration: d }),
    dismiss,
  }), [show, dismiss]);

  // Portal target
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toastNode = (
    <div className="fixed z-[9999] top-4 right-4 flex flex-col gap-2 w-[88vw] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative rounded-md px-4 py-3 text-sm shadow-lg border transition-all duration-200
            ${t.type === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
            ${t.type === "error" ? "bg-red-50 border-red-200 text-red-800" : ""}
            ${t.type === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-800" : ""}
            ${t.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" : ""}
          `}
        >
          <div className="pr-6">{t.message}</div>
          <button
            className="absolute top-2 right-2 text-xs text-gray-500 hover:text-gray-700"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted ? createPortal(toastNode, document.body) : null}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
