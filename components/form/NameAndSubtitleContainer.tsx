"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/form/FormInput";
import FormCheckbox from "@/components/form/FormCheckbox";

interface NameAndSubtitleContainerProps {
  defaultName?: string;
  defaultSubtitle?: string;
}

const NameAndSubtitleContainer = ({
  defaultName,
  defaultSubtitle = "",
}: NameAndSubtitleContainerProps) => {
  const [showSubtitle, setShowSubtitle] = useState(!!defaultSubtitle);
  const [subtitle, setSubtitle] = useState<string>(defaultSubtitle);

  const handleCheckboxChange = (checked: boolean) => {
    setShowSubtitle(checked);
    if (!checked) {
      setSubtitle("");
    }
  };

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-2 md:gap-8">
      {/* Name Input */}
      <div className="">
        <div className="w-full">
          <FormInput
            name="name"
            type="text"
            label="Event Name*"
            placeholder="Enter your event name"
            required={true}
            defaultValue={defaultName}
          />
        </div>

        {/* Checkbox for Subtitle */}
        <div className="ml-1 mt-5 flex-grow text-muted-foreground">
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
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden input to ensure the subtitle is part of the form data */}
      <input type="hidden" name="subtitle" value={subtitle} />
    </div>
  );
};

export default NameAndSubtitleContainer;
