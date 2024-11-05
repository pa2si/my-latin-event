// not from shadcn
interface HeaderSectionProps {
  title: string;
  description: string;
}

const HeaderSection = ({ title, description }: HeaderSectionProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default HeaderSection;
