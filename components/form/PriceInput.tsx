"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SelectionDialog from "@/components/form/SelectionDialog";

const name = "price";

type FormInputNumberProps = {
  defaultValue?: number;
};

function PriceInput({ defaultValue }: FormInputNumberProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(defaultValue || 8);

  const handlePriceChange = (value: number) => {
    setSelectedPrice(value);
    setIsOpen(false);
  };

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Price (€)
      </Label>
      <div className="flex items-center gap-4">
        <Input
          id={name}
          type="number"
          min={0}
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(Number(e.target.value))}
          required
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="ml-2"
        >
          Choose Price
        </Button>
      </div>

      <SelectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Choose a Price"
        width="w-72"
      >
        <div className="h-44" />
        {Array.from({ length: 1000 }, (_, i) => i + 1).map((price) => (
          <div
            key={price}
            onClick={() => handlePriceChange(price)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center rounded p-2 hover:bg-gray-100",
              price === selectedPrice && "font-bold text-primary",
            )}
          >
            {price}
          </div>
        ))}
        <div className="h-44" />
      </SelectionDialog>

      <input type="hidden" name={name} value={selectedPrice} />
    </div>
  );
}

export default PriceInput;
