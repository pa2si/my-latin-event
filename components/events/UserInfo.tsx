import Image from "next/image";
import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";

type UserInfoProps = {
  profile: {
    profileImage: string;
    firstName: string;
    slogan?: string | null;
  };
};

const UserInfo = ({
  profile: { profileImage, firstName, slogan },
}: UserInfoProps) => {
  return (
    <article className="mt-4 grid grid-cols-[auto,1fr] gap-4">
      <Image
        src={profileImage}
        alt={firstName}
        width={50}
        height={50}
        className="h-12 w-12 rounded-md object-cover"
      />
      <div>
        <p>
          Hosted by
          <span className="font-bold"> {firstName}</span>
        </p>
        <div className="flex gap-1">
          {slogan && (
            <>
              <RiDoubleQuotesL className="w-5 text-primary" />
              <p className="font-light text-muted-foreground">{slogan}</p>
              <RiDoubleQuotesR className="w-5 text-primary" />
            </>
          )}
        </div>
      </div>
    </article>
  );
};
export default UserInfo;
