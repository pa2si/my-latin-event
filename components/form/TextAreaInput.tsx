"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type TextAreaInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
};

function TextAreaInput({ name, labelText, defaultValue }: TextAreaInputProps) {
  const WORD_LIMIT = 100;

  const [content, setContent] = useState(
    defaultValue || tempDefaultDescription,
  );
  const [wordCount, setWordCount] = useState(() => {
    const initialText = defaultValue || tempDefaultDescription;
    return initialText.trim().split(/\s+/).filter(Boolean).length;
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const words = newText.trim().split(/\s+/).filter(Boolean);
    const newWordCount = words.length;

    if (newWordCount <= WORD_LIMIT || newText.length < content.length) {
      // Allow if under limit or if deleting characters
      setContent(newText);
      setWordCount(newWordCount);
      e.target.value = newText; // Update the input value
    } else {
      // If over limit, keep the previous content
      e.target.value = content;
    }
  };

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize font-antonio font-bold tracking-wide text-md">
        {labelText || name}
      </Label>

      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue || tempDefaultDescription}
        rows={5}
        className="leading-loose font-mono tracking-tight"
        onInput={handleChange}
      />

      <p
        className={`mt-1 text-sm ${wordCount >= WORD_LIMIT ? "text-red-500" : "text-gray-500"}`}
      >
        {wordCount} / {WORD_LIMIT} words
        {wordCount >= WORD_LIMIT && " (limit reached)"}
      </p>
    </div>
  );
}

const tempDefaultDescription = "My event is super great!";

export default TextAreaInput;
