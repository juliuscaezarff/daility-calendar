import { atom } from "jotai";

import { draggingAtom, isResizingAtom } from "@/atoms/drag-resize-state";
import { selectedEventIdsAtom } from "@/atoms/selected-events";

export const windowStateAtom = atom<"default" | "expanded">((get) => {
  const events = get(selectedEventIdsAtom);
  const isDragging = get(draggingAtom) !== null;
  const isResizing = get(isResizingAtom);

  if (isDragging || isResizing) {
    return "default";
  }

  return events.length > 0 ? "expanded" : "default";
});
