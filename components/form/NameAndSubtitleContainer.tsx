"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/form/FormInput";
import FormCheckbox from "@/components/form/FormCheckbox";

const NameAndSubtitleContainer = () => {
  const [showSubtitle, setShowSubtitle] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setShowSubtitle(checked);
  };

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-2 md:gap-8">
      {/* Name Input */}
      <div className="flex items-center justify-between gap-2">
        <div className="w-full">
          <FormInput
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your event name"
            required={true}
            defaultValue="My Event"
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

      {/* Subtitle Input conditionally rendered */}
      <AnimatePresence>
        {showSubtitle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FormInput
              name="subtitle"
              type="text"
              label="Subtitle"
              placeholder="Enter a subtitle like 'Volume 1'"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NameAndSubtitleContainer;
