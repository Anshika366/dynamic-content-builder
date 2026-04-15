import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Block({ block, dispatch }) {
  const [isFocused, setIsFocused] = useState(false);

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
    zIndex: isDragging ? 100 : "auto",
  };

  const updateContent = (newData) => {
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, content: { ...block.content, ...newData } },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-2xl border-2 transition-all duration-300 ${
        isDragging
          ? "opacity-40 shadow-2xl scale-[1.02] border-blue-500"
          : isFocused
            ? "border-blue-400 shadow-lg ring-4 ring-blue-50"
            : "border-slate-100 hover:border-slate-300 hover:shadow-md"
      }`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Block Toolbar - Grip and Red-on-Hover Delete */}
      <div
        className={`flex items-center justify-between px-5 py-2 transition-colors rounded-t-2xl ${
          isFocused ? "bg-blue-50/50" : "bg-slate-50/30"
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-300 hover:text-blue-500 p-1 touch-none"
        >
          <GripVertical size={18} />
        </div>
        {/* Updated Delete Button: Black by default, Red on Hover */}
        <button
          onClick={() => dispatch({ type: "DELETE_BLOCK", payload: block.id })}
          className="text-slate-600 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-7">
        {block.type === "header" && (
          <div className="flex gap-4 items-center">
            {/* Header Level Selector */}
            <div className="relative group/select min-w-[80px]">
              <select
                value={block.content.level}
                onChange={(e) =>
                  updateContent({ level: Number(e.target.value) })
                }
                className="appearance-none w-full bg-slate-100 border-none rounded-xl pl-4 pr-9 py-2 text-sm font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-400 transition-all hover:bg-slate-200"
              >
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ChevronDown size={14} />
              </div>
            </div>

            <input
              type="text"
              value={block.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              className={`w-full font-black border-none focus:ring-0 p-0 text-slate-800 placeholder-slate-300 bg-transparent transition-all ${
                block.content.level === 1
                  ? "text-4xl"
                  : block.content.level === 2
                    ? "text-3xl"
                    : "text-2xl"
              }`}
              placeholder="Enter Heading Text..."
            />
          </div>
        )}

        {block.type === "text" && (
          <textarea
            value={block.content.text}
            onChange={(e) => updateContent({ text: e.target.value })}
            placeholder="Write your content here..."
            className="w-full border-none focus:ring-0 resize-none min-h-[100px] p-0 text-lg text-slate-600 leading-relaxed placeholder-slate-200 bg-transparent"
          />
        )}

        {block.type === "image" && (
          <div className="space-y-4">
            <input
              type="text"
              value={block.content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="Paste image link here..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-300 outline-none transition-all text-slate-600"
            />
            {block.content.url && (
              <img
                src={block.content.url}
                alt="Preview"
                className="w-full h-auto rounded-xl shadow-md border-4 border-white max-h-[400px] object-contain mx-auto transition-transform hover:scale-[1.005]"
              />
            )}
          </div>
        )}

        {block.type === "markdown" && (
          <div className="flex flex-col md:flex-row gap-5 min-h-[180px]">
            <textarea
              value={block.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              placeholder="# Markdown Support"
              className="flex-1 bg-slate-900 text-blue-50 rounded-xl p-5 font-mono text-sm min-h-[180px] border-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
            <div className="flex-1 prose prose-slate p-5 border border-slate-100 rounded-xl bg-slate-50/50 overflow-auto max-h-[250px]">
              <ReactMarkdown>
                {block.content.text || "*Markdown preview will appear here*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
