import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Block({ block, dispatch }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group mb-4">
      {/* Handle for dragging */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 cursor-grab p-2 bg-white shadow rounded"
      >
        ⋮⋮
      </div>

      {/* Rest of your block rendering code based on block.type */}
      <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
        {block.type === "header" && <h1>{block.content.text}</h1>}
        {/* ... other types ... */}
        <button
          onClick={() => dispatch({ type: "DELETE_BLOCK", payload: block.id })}
          className="text-red-500 text-xs mt-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
