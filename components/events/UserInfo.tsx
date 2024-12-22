import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

type UserInfoProps = {
  organizer: {
    organizerImage: string;
    organizerName: string;
    slogan?: string | null;
  };
};

const UserInfo = ({
  organizer: { organizerImage, organizerName, slogan },
}: UserInfoProps) => {
  return (
    <article className="mt-4 grid grid-cols-[auto,1fr] gap-4">
      <img
        src={organizerImage}
        alt={organizerName}
        className="h-12 w-12 rounded-md object-cover"
      />
      <div>
        <p>
          <span className="font-bold">{organizerName}</span>
        </p>
        {slogan && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <RiDoubleQuotesL className="h-3 w-3 shrink-0 text-primary" />
            <p className="line-clamp-2 font-light italic">{slogan}</p>
            <RiDoubleQuotesR className="h-3 w-3 shrink-0 text-primary" />
          </div>
        )}
      </div>
    </article>
  );
};

export default UserInfo;
