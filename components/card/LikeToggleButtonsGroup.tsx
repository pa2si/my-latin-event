"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import LikeToggleButton from "./LikeToggleButton";
import { fetchLikeIds } from "@/utils/actions";

function LikeToggleButtonsGroup({ events }: { events: { id: string }[] }) {
    const { isSignedIn, userId } = useAuth();
    const [likeIds, setLikeIds] = useState<Record<string, string | null>>({});

    useEffect(() => {
        if (userId && events.length > 0) {
            const eventIds = events.map((event) => event.id);
            fetchLikeIds({ eventIds }).then(setLikeIds);
        }
    }, [userId, events]);

    if (!isSignedIn) {
        return events.map((event) => (
            <LikeToggleButton key={event.id} eventId={event.id} likeId={null} />
        ));
    }

    return events.map((event) => (
        <LikeToggleButton
            key={event.id}
            eventId={event.id}
            likeId={likeIds[event.id] || null}
        />
    ));
}

export default LikeToggleButtonsGroup;
