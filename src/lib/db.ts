import * as React from "react";
import { useAtomValue } from "jotai";
import { Temporal } from "temporal-polyfill";

import { eventsAtom } from "@/atoms/events";
import { jotaiStore } from "@/atoms/store";
import { useZonedDateTime } from "@/components/calendar/context/datetime-provider";
import type { CalendarEvent } from "./interfaces";

export async function getEventById(id: string): Promise<CalendarEvent | undefined> {
  const events = jotaiStore.get(eventsAtom);
  return events.find((e) => e.id === id);
}

export function useLiveEventById(id: string): CalendarEvent | undefined {
  const events = useAtomValue(eventsAtom);
  return React.useMemo(() => events.find((e) => e.id === id), [events, id]);
}

export function useOngoingEvent(): CalendarEvent[] {
  const events = useAtomValue(eventsAtom);
  const now = useZonedDateTime();

  return React.useMemo(() => {
    const nowInstant = now.toInstant();
    return events.filter((e) => {
      if (e.allDay) return false;
      const start =
        e.start instanceof Temporal.ZonedDateTime
          ? e.start.toInstant()
          : e.start instanceof Temporal.Instant
            ? e.start
            : null;
      const end =
        e.end instanceof Temporal.ZonedDateTime
          ? e.end.toInstant()
          : e.end instanceof Temporal.Instant
            ? e.end
            : null;
      if (!start || !end) return false;
      return (
        Temporal.Instant.compare(start, nowInstant) <= 0 &&
        Temporal.Instant.compare(end, nowInstant) >= 0
      );
    });
  }, [events, now]);
}

export function useUpcomingEvent(): CalendarEvent[] {
  const events = useAtomValue(eventsAtom);
  const now = useZonedDateTime();

  return React.useMemo(() => {
    const nowInstant = now.toInstant();
    const upcoming = events
      .filter((e) => {
        if (e.allDay) return false;
        const start =
          e.start instanceof Temporal.ZonedDateTime
            ? e.start.toInstant()
            : e.start instanceof Temporal.Instant
              ? e.start
              : null;
        if (!start) return false;
        return Temporal.Instant.compare(start, nowInstant) > 0;
      })
      .sort((a, b) => {
        const aStart =
          a.start instanceof Temporal.ZonedDateTime
            ? a.start.toInstant()
            : (a.start as Temporal.Instant);
        const bStart =
          b.start instanceof Temporal.ZonedDateTime
            ? b.start.toInstant()
            : (b.start as Temporal.Instant);
        return Temporal.Instant.compare(aStart, bStart);
      });

    if (upcoming.length === 0) return [];

    const firstStart =
      upcoming[0]!.start instanceof Temporal.ZonedDateTime
        ? upcoming[0]!.start.toInstant()
        : (upcoming[0]!.start as Temporal.Instant);

    return upcoming.filter((e) => {
      const s =
        e.start instanceof Temporal.ZonedDateTime
          ? e.start.toInstant()
          : (e.start as Temporal.Instant);
      return Temporal.Instant.compare(s, firstStart) === 0;
    });
  }, [events, now]);
}
