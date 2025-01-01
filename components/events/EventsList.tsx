"use client";

import EventCard from "../card/EventCard";
import type { EventCardProps } from "@/utils/types";
import { motion, AnimatePresence } from "framer-motion";

interface EventsListProps {
  events: EventCardProps[];
  likeIds: Record<string, string | null>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const EventsList = ({ events, likeIds }: EventsListProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {events.map((event) => (
          <motion.div key={event.id} variants={item} layout>
            <EventCard event={event} likeId={likeIds[event.id] ?? null} />
          </motion.div>
        ))}
      </motion.section>
    </AnimatePresence>
  );
};

export default EventsList;
