"use client";

import React, { forwardRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  value?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasMaxChar?: boolean;
  maxChar?: number;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      name,
      type,
      defaultValue,
      placeholder,
      description,
      required,
      value,
      className,
      onChange,
      onFocus,
      disabled,
      hasMaxChar,
      maxChar = 50, // Default value if hasMaxChar is true
    },
    ref,
  ) => {
    const [charCount, setCharCount] = useState(defaultValue?.length || 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasMaxChar) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e);
    };

    return (
      <div className="mb-2">
        <Label
          htmlFor={name}
          className="text-md font-antonio capitalize tracking-wide"
        >
          {label || name}
        </Label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <div className="relative">
          <Input
            id={name}
            name={name}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={handleChange}
            required={required}
            value={value}
            className={className}
            ref={ref}
            onFocus={onFocus}
            disabled={disabled}
            maxLength={hasMaxChar ? maxChar : undefined}
          />
          {hasMaxChar && (
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                charCount >= maxChar
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {charCount}/{maxChar}
            </div>
          )}
        </div>
      </div>
    );
  },
);

FormInput.displayName = "FormInput"; // This is required to avoid issues with forwardRef

export default FormInput;
