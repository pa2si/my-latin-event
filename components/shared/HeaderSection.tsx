import React from "react";
import BreadCrumbs from "@/components/events/BreadCrumbs";
import TitleHOne from "@/components/shared/TitleHOne"; // Add import

interface HeaderSectionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<any> | string; // Add icon prop
  breadcrumb?: {
    name: string;
    parentPath?: string;
    parentName?: string;
  };
}

const HeaderSection = ({
  title,
  description,
  icon, // Destructure with alias for JSX usage
  breadcrumb,
}: HeaderSectionProps) => {
  return (
    <div className="mb-8">
      {breadcrumb && <BreadCrumbs {...breadcrumb} />}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          {/* Show React component icon before title */}
          {icon &&
            typeof icon !== "string" &&
            React.createElement(icon, { className: "h-7 w-7" })}
          <TitleHOne text={title} />
          {/* Show emoji after title */}
          {icon && typeof icon === "string" && (
            <span className="mt-1 text-2xl">{icon}</span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
