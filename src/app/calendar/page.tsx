import { CalendarLayout } from "@/components/calendar-layout";
import { DateProvider } from "@/components/calendar/context/date-provider";
import { ZonedDateTimeProvider } from "@/components/calendar/context/datetime-provider";

export default async function CalendarPage() {
  return (
    <ZonedDateTimeProvider>
      <DateProvider>
        <CalendarLayout />
      </DateProvider>
    </ZonedDateTimeProvider>
  );
}
