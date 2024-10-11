'use client';

import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import SelectModal from './SelectModal'; // Assuming you have SelectModal component
import { SelectButton } from '@/components/form/Buttons'; // Assuming you have SelectButton component

const name = 'price';

type FormInputNumberProps = {
  defaultValue?: number;
};

function PriceInput({ defaultValue }: FormInputNumberProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(defaultValue || 8);

  const handlePriceChange = (value: number) => {
    setSelectedPrice(value);
    setModalVisible(false); // Close modal after selection
  };

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Price (€)
      </Label>
      <div className="flex gap-4 items-center">
        {/* Numeric input for price */}
        <Input
          id={name}
          type="number"
          name={name}
          min={0}
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(Number(e.target.value))}
          required
        />

        {/* Button to open the price selection modal */}
        <SelectButton
          text="Choose Price"
          onClick={() => setModalVisible(true)}
          className="ml-2"
        />
      </div>

      {/* Price selection modal */}
      <SelectModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Choose a Price"
      >
        <div className="flex flex-col p-4 h-72 overflow-scroll items-center w-full">
          {Array.from({ length: 1000 }, (_, i) => i + 1).map((price) => (
            <div
              key={price}
              onClick={() => handlePriceChange(price)}
              className="cursor-pointer hover:bg-gray-300 p-2 rounded flex items-center"
            >
              €{price}
            </div>
          ))}
        </div>
      </SelectModal>

      {/* Hidden input field to submit the selected price */}
      <input type="hidden" name={name} value={selectedPrice} />
    </div>
  );
}

export default PriceInput;
