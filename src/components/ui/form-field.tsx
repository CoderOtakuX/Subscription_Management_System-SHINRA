"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BaseFormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}

export interface InputFieldProps
  extends BaseFormFieldProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface TextareaFieldProps
  extends BaseFormFieldProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

export interface SelectFieldProps
  extends BaseFormFieldProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  as: "select";
  options?: { label: string; value: string | number }[];
}

export type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

export const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(function FormField(props, ref) {
  const {
    label,
    description,
    error,
    required,
    className,
    id,
    as = "input",
    children,
    ...rest
  } = props;

  const generatedId =
    id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-").split("-").filter(Boolean).join("-") : undefined);

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={generatedId}
            className="text-body-sm font-semibold text-on-surface"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}

      {children ? (
        React.isValidElement(children) ? (
          React.cloneElement(children as React.ReactElement<any>, {
            id: (children.props as any).id || generatedId,
            "aria-label": (children.props as any)["aria-label"] || (children.props as any).placeholder || label,
          })
        ) : (
          children
        )
      ) : (
        <div className="relative">
        {as === "input" && (
          <div className="relative flex items-center">
            {"leftIcon" in props && props.leftIcon && (
              <div className="absolute left-3 text-on-surface-muted pointer-events-none flex items-center justify-center">
                {props.leftIcon}
              </div>
            )}
            <input
              id={generatedId}
              aria-label={label || (props as any)["aria-label"] || (props as any).placeholder || "Input field"}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className={cn(
                "w-full px-3.5 py-2.5 text-base sm:text-body-md rounded-md bg-surface border text-on-surface placeholder:text-on-surface-muted transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]",
                "leftIcon" in props && props.leftIcon && "pl-10",
                "rightIcon" in props && props.rightIcon && "pr-10",
                error
                  ? "border-red-400 focus:ring-red-400"
                  : "border-outline hover:border-outline-variant"
              )}
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            />
            {"rightIcon" in props && props.rightIcon && (
              <div className="absolute right-3 text-on-surface-muted flex items-center justify-center">
                {props.rightIcon}
              </div>
            )}
          </div>
        )}

        {as === "textarea" && (
          <textarea
            id={generatedId}
            aria-label={label || (props as any)["aria-label"] || (props as any).placeholder || "Text area"}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={cn(
              "w-full px-3.5 py-2.5 text-base sm:text-body-md rounded-md bg-surface border text-on-surface placeholder:text-on-surface-muted transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[88px]",
              error
                ? "border-red-400 focus:ring-red-400"
                : "border-outline hover:border-outline-variant"
            )}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        )}

        {as === "select" && (
          <select
            id={generatedId}
            aria-label={label || (props as any)["aria-label"] || "Select option"}
            ref={ref as React.ForwardedRef<HTMLSelectElement>}
            className={cn(
              "w-full px-3.5 py-2.5 text-base sm:text-body-md rounded-md bg-surface border text-on-surface transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]",
              error
                ? "border-red-400 focus:ring-red-400"
                : "border-outline hover:border-outline-variant"
            )}
            {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {"options" in props &&
              props.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            {props.children}
          </select>
        )}
      </div>
    )}

      {description && !error && (
        <p className="text-body-sm text-on-surface-muted">{description}</p>
      )}

      {error && (
        <p className="text-body-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
});
