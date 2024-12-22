import { Card, CardContent } from "@/components/ui/card";
import UserInfo from "@/components/events/UserInfo";
import FollowToggleButton from "@/components/card/FollowToggleButton";
import { checkFollowAccess } from "@/utils/actions";
import { Calendar, Mail, Globe, Phone, Share2 } from "lucide-react";
import { Organizer } from "@/utils/types";

const OrganizerCard = async ({
  id,
  organizerName,
  organizerImage,
  slogan,
  contactEmail,
  contactWebsite,
  contactPhone,
  contactSocialMedia,
  _count,
}: Organizer) => {
  const { canFollow } = await checkFollowAccess(id);
  const eventCount = _count?.events ?? 0; // Provide default value of 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3
            className={`font-mono text-lg font-semibold ${canFollow ? "mb-4" : ""}`}
          >
            Event Organizer
          </h3>
          <div className="-mt-2">
            {canFollow && <FollowToggleButton organizerId={id} />}
          </div>
        </div>

        <UserInfo
          organizer={{
            organizerName,
            organizerImage,
            slogan,
          }}
        />

        {/* Contact Information */}
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          {contactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${contactEmail}`} className="hover:text-primary">
                {contactEmail}
              </a>
            </div>
          )}

          {contactWebsite && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <a
                href={contactWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {contactWebsite}
              </a>
            </div>
          )}

          {contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${contactPhone}`} className="hover:text-primary">
                {contactPhone}
              </a>
            </div>
          )}

          {contactSocialMedia && (
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <a
                href={
                  contactSocialMedia.startsWith("http")
                    ? contactSocialMedia
                    : `https://${contactSocialMedia}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {contactSocialMedia}
              </a>
            </div>
          )}
        </div>

        {/* Events count moved into contact information section */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{eventCount} events created</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizerCard;
