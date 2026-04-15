import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Heading, Type, Image as ImageIcon, FileCode } from "lucide-react";

const ITEMS = [
  { type: "header", icon: <Heading size={20} />, label: "Header" },
  { type: "text", icon: <Type size={20} />, label: "Rich Text" },
  { type: "image", icon: <ImageIcon size={20} />, label: "Image" },
  { type: "markdown", icon: <FileCode size={20} />, label: "Markdown" },
];

export default function Palette() {
  return (
    <div className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col gap-6 h-screen sticky top-0 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800">Components</h2>
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <PaletteItem key={item.type} {...item} />
        ))}
      </div>
    </div>
  );
}

function PaletteItem({ type, icon, label }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-50 bg-white cursor-grab shadow-sm transition-all hover:border-blue-400 hover:shadow-md ${isDragging ? "opacity-30 ring-2 ring-blue-500" : ""}`}
    >
      <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100">
        {icon}
      </div>
      <span className="font-semibold text-slate-700">{label}</span>
    </div>
  );
}
