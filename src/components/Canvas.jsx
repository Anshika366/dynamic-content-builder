import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Canvas({ children, blocks }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50 min-h-screen">
      <div
        ref={setNodeRef}
        className={`w-full max-w-3xl mx-auto min-h-[80vh] rounded-3xl transition-all duration-300 ${isOver ? "bg-blue-50/50 ring-4 ring-blue-100 ring-dashed" : ""}`}
      >
        {blocks.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-3xl text-slate-400 bg-white">
            <p className="text-xl font-medium">Drag components here to build</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-20">{children}</div>
        )}
      </div>
    </div>
  );
}
