import React from "react";
import { Organizer } from "@/utils/types";
import { EditOrganizerDialog } from "./OrganizerDialog";
import { DeleteOrganizerDialog } from "./DeleteOrganizerDialog";

type OrganizerProfileProps = {
  organizer: Organizer;
};

const OrganizerProfile: React.FC<OrganizerProfileProps> = ({ organizer }) => {
  return (
    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-accent/5">
      <div className="flex items-center space-x-4">
        <img
          src={organizer.organizerImage}
          alt={organizer.organizerName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="grid gap-1">
          <p className="font-medium">{organizer.organizerName}</p>
          <p className="text-sm text-muted-foreground">{organizer.slogan}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <EditOrganizerDialog organizer={organizer} />
        <DeleteOrganizerDialog organizer={organizer} />
      </div>
    </div>
  );
};

export default OrganizerProfile;
