"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SelectionDialog from "@/components/form/SelectionDialog";
import { useGenreStylesStore } from "@/utils/store";

const name = "price";

function PriceInput({ defaultValue }: { defaultValue?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(defaultValue || "8");
  const currency = useGenreStylesStore(state => state.selectedCurrency);

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    setIsOpen(false);
  };

  const displayValue = selectedPrice === "Free" || selectedPrice === "Donation"
    ? selectedPrice
    : `${selectedPrice} ${currency}`;

  return (
    <div className="mb-4">
      <Label htmlFor={name} className="capitalize font-antonio font-bold tracking-wide text-md">Price</Label>
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          {displayValue}
        </Button>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Currency is automatically set based on the event&apos;s country location
        </p>
      </div>

      <SelectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Choose a Price"
        width="w-72"
      >
        <div className="h-44" />
        {["Free", "Donation"].map((option) => (
          <div
            key={option}
            onClick={() => handlePriceChange(option)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center rounded p-2 hover:bg-gray-100 font-antonio font-medium tracking-wide text-md",
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
              "flex w-full cursor-pointer items-center justify-center rounded p-2 hover:bg-gray-100 font-antonio font-medium tracking-wide text-md",
              price.toString() === selectedPrice && "font-bold text-primary",
            )}
          >
            {price} {currency}
          </div>
        ))}
        <div className="h-44" />
      </SelectionDialog>

      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name={name} value={selectedPrice} />
    </div>
  );
}

export default PriceInput;