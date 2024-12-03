import React from 'react';
import BreadCrumbs from "@/components/events/BreadCrumbs";

interface HeaderSectionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<any> | string;// Add icon prop
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
          {icon && typeof icon !== 'string' &&
            React.createElement(icon, { className: "h-6 w-6" })
          }
          <h1 className="text-2xl font-semibold capitalize">{title}</h1>
          {/* Show emoji after title */}
          {icon && typeof icon === 'string' &&
            <span className="text-2xl">{icon}</span>
          }
        </div>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;