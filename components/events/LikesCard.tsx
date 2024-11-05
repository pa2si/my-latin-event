import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface LikesCardProps {
  likes: number;
}

const LikesCard = ({ likes }: LikesCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Likes</h3>
          </div>
          <span className="text-2xl font-bold text-primary">{likes}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          People interested in this event
        </p>
      </CardContent>
    </Card>
  );
};

export default LikesCard;
