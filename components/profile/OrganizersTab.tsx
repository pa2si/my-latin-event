import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Organizer } from "@/utils/types";
import OrganizerProfile from "./OrganizerProfile";
import { AddOrganizerDialog } from "./OrganizerDialog";
import { MessageCircle } from "lucide-react";

type OrganizersTabProps = {
  organizers: Organizer[];
};

const OrganizersTab: React.FC<OrganizersTabProps> = ({ organizers = [] }) => {
  return (
    <section>
      <Card className="-m-8 border-0 shadow-none">
        <CardHeader>
          <CardTitle>Organizer Settings</CardTitle>
          <CardDescription>
            Manage your organizer profiles and create new ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {organizers.length === 0 ? (
            <div className="flex gap-2">
              <MessageCircle />{" "}
              <p>
                You haven not created any organizers yet. Add your first
                organizer to start creating events!
              </p>
            </div>
          ) : null}

          <AddOrganizerDialog />

          <div className="space-y-4">
            {organizers.map((organizer) => (
              <OrganizerProfile key={organizer.id} organizer={organizer} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OrganizersTab;
