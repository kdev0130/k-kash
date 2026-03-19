"use client";

import { useState, useCallback } from "react";
import type { SheetType } from "@/types/ui";

export function useSheet() {
  const [sheet, setSheet] = useState<SheetType>(null);

  const open = useCallback((type: NonNullable<SheetType>) => {
    setSheet(type);
  }, []);

  const close = useCallback(() => {
    setSheet(null);
  }, []);

  return { sheet, open, close };
}
