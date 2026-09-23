"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

/**
 * Soft deterrents against casual copy / save / image drag on marketing pages.
 * Cannot fully prevent downloads (browsers must fetch assets to render).
 */
export function ContentProtection() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      const el = e.target;
      if (el instanceof HTMLImageElement || el instanceof HTMLAnchorElement) {
        e.preventDefault();
      }
    };

    const onCopy = (e: ClipboardEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      // Block save / view-source / select-all / print on protected content
      if (key === "s" || key === "u" || key === "a" || key === "p") {
        e.preventDefault();
      }
      // Soft-block common “inspect” shortcuts (easily bypassed)
      if (e.shiftKey && (key === "i" || key === "j" || key === "c")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
