import React from "react";

interface DescriptionProps {
  description: string;
}

const TabDescription = ({ description }: DescriptionProps) => {
  return <p className="mb-8 text-muted-foreground">{description}</p>;
};

export default TabDescription;
