"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SelectionDialog from "@/components/form/SelectionDialog";

const name = "price";

type FormInputPriceProps = {
  defaultValue?: string;
};

const SPECIAL_OPTIONS = ["Free", "Donation"];

function PriceInput({ defaultValue }: FormInputPriceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(defaultValue || "8");

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    setIsOpen(false);
  };

  const displayValue = selectedPrice === "Free" || selectedPrice === "Donation"
    ? selectedPrice
    : `${selectedPrice}€`;

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Price
      </Label>
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          {displayValue}
        </Button>
      </div>

      <SelectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Choose a Price"
        width="w-72"
      >
        <div className="h-44" />
        {SPECIAL_OPTIONS.map((option) => (
          <div
            key={option}
            onClick={() => handlePriceChange(option)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center rounded p-2 hover:bg-gray-100",
              option === selectedPrice && "font-bold text-primary",
            )}
          >
            {option}
          </div>
        ))}
        {Array.from({ length: 501 }, (_, i) => i).map((price) => (
          <div
            key={price}
            onClick={() => handlePriceChange(price.toString())}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center rounded p-2 hover:bg-gray-100",
              price.toString() === selectedPrice && "font-bold text-primary",
            )}
          >
            {price}€
          </div>
        ))}
        <div className="h-44" />
      </SelectionDialog>

      <input type="hidden" name={name} value={selectedPrice} />
    </div>
  );
}

export default PriceInput;
