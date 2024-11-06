import BreadCrumbs from "@/components/events/BreadCrumbs";

interface HeaderSectionProps {
  title: string;
  description: string;
  breadcrumb: {
    name: string;
    parentPath?: string;
    parentName?: string;
  };
}

const HeaderSection = ({
  title,
  description,
  breadcrumb,
}: HeaderSectionProps) => {
  return (
    <div className="mb-8">
      <BreadCrumbs {...breadcrumb} />
      <div className="mt-8">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default HeaderSection;
