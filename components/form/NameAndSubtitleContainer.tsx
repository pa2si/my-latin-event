'use client';

import React, { useState } from 'react';
import FormInput from '@/components/form/FormInput';
import FormCheckbox from '@/components/form/FormCheckbox';

const NameAndSubtitleContainer = () => {
  const [showSubtitle, setShowSubtitle] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setShowSubtitle(checked);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-4">
      {/* Name Input */}
      <div className="flex gap-2 items-center justify-between ">
        <div className="w-full">
          <FormInput
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your event name"
            required={true}
          />
        </div>

        {/* Checkbox for Subtitle */}
        <div className="mt-4 flex-grow">
          <FormCheckbox
            id="add-subtitle"
            label="Add Subtitle"
            checked={showSubtitle}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
      </div>

      {/* Subtitle Input (conditionally rendered) */}
      {showSubtitle && (
        <FormInput
          name="subtitle"
          type="text"
          label="Subtitle"
          placeholder="Enter a subtitle like 'Volume 1'"
        />
      )}
    </div>
  );
};

export default NameAndSubtitleContainer;
