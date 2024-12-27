"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { IconButton } from "@/components/form/Buttons";
import DeleteEvent from "@/components/events/DeleteEvent";
import { deleteMultipleEventsAction } from "@/utils/actions";

type SortDirection = "asc" | "desc" | null;
type SortableField =
  | "name"
  | "organizer"
  | "date"
  | "location"
  | "price"
  | "likes";
type SortField = SortableField | null;

interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface Event {
  id: string;
  name: string;
  location: string;
  price: string;
  eventDateAndTime: Date;
  organizer: {
    organizerName: string;
  };
  _count: {
    likes: number;
  };
}

type SortButtonProps = {
  field: SortableField;
  currentSort: SortState;
  onSort: (field: SortableField) => void;
};

const SortButton = ({ field, currentSort, onSort }: SortButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => onSort(field)}
    >
      <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
      {currentSort.field === field ? (
        currentSort.direction === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

function MultipleDeleteEvents({ events: initialEvents }: { events: Event[] }) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sort, setSort] = useState<SortState>({ field: null, direction: null });
  const { toast } = useToast();
  const router = useRouter();

  const handleSort = (field: SortableField) => {
    setSort((prevSort) => ({
      field,
      direction:
        prevSort.field === field && prevSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortEvents = (events: Event[]): Event[] => {
    if (!sort.field || !sort.direction) return events;

    return [...events].sort((a, b) => {
      let compareA: any;
      let compareB: any;

      switch (sort.field) {
        case "name":
          compareA = a.name;
          compareB = b.name;
          break;
        case "organizer":
          compareA = a.organizer.organizerName;
          compareB = b.organizer.organizerName;
          break;
        case "date":
          compareA = new Date(a.eventDateAndTime);
          compareB = new Date(b.eventDateAndTime);
          break;
        case "location":
          compareA = a.location;
          compareB = b.location;
          break;
        case "price":
          // Handle special cases like "Free" or "Donation"
          compareA =
            a.price === "Free"
              ? -1
              : a.price === "Donation"
                ? -2
                : parseFloat(a.price);
          compareB =
            b.price === "Free"
              ? -1
              : b.price === "Donation"
                ? -2
                : parseFloat(b.price);
          break;
        case "likes":
          compareA = a._count.likes;
          compareB = b._count.likes;
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return sort.direction === "asc" ? -1 : 1;
      if (compareA > compareB) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedEvents = sortEvents(initialEvents);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(sortedEvents.map((event) => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const formData = new FormData();
      formData.append("eventIds", JSON.stringify(selectedEvents));

      const result = await deleteMultipleEventsAction({}, formData);

      toast({
        description: result.message,
        className: "bg-primary/90 text-secondary",
      });

      if (!result.message.toLowerCase().includes("error")) {
        setSelectedEvents([]);
        router.refresh();
      }
    } catch (error) {
      toast({
        description: "An error occurred while deleting events",
        className: "bg-destructive text-destructive-foreground",
      });
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="capitalize">Active Events : {sortedEvents.length}</h4>
        {selectedEvents.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedEvents.length})
          </Button>
        )}
      </div>

      <Table>
        <TableCaption>A list of all your events.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedEvents.length === sortedEvents.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>
              <SortButton field="name" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead>
              <SortButton
                field="organizer"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortButton field="date" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead>
              <SortButton
                field="location"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortButton
                field="price"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortButton
                field="likes"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => {
            const formattedDate = format(
              new Date(event.eventDateAndTime),
              "dd.MM.yy",
            );
            return (
              <TableRow key={event.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) =>
                      handleSelectEvent(event.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/events/${event.id}`}
                    className="tracking-wide text-muted-foreground underline"
                  >
                    {event.name}
                  </Link>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {event.organizer.organizerName}
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.price}</TableCell>
                <TableCell>{event._count.likes}</TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/my-events/${event.id}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>
                  <DeleteEvent eventId={event.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedEvents.length} selected
              events. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete {selectedEvents.length} Events
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MultipleDeleteEvents;
