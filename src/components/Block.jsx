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
    opacity: isDragging ? 0.6 : 1,
  };

  const updateContent = (newContent) => {
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, content: { ...block.content, ...newContent } },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group mb-6 flex items-start"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-4 mr-2 p-2 bg-white border border-slate-200 shadow-sm rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="gray">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-12a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
        </svg>
      </div>

      {/* Main Content Box */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
        <button
          onClick={() => dispatch({ type: "DELETE_BLOCK", payload: block.id })}
          className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 text-xs font-bold"
        >
          ✕
        </button>

        {block.type === "header" && (
          <div>
            <input
              className="text-2xl font-bold w-full outline-none border-b border-transparent focus:border-blue-300 pb-1"
              value={block.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              placeholder="Enter Header..."
            />
          </div>
        )}

        {block.type === "richText" && (
          <textarea
            className="w-full h-24 outline-none border-none resize-none text-slate-700"
            value={block.content.text}
            onChange={(e) => updateContent({ text: e.target.value })}
            placeholder="Start typing your story..."
          />
        )}

        {block.type === "image" && (
          <div className="space-y-3">
            <input
              className="w-full text-sm border-b border-slate-200 focus:border-blue-400 outline-none p-1"
              value={block.content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="Paste Image URL here..."
            />
            {block.content.url ? (
              <img
                src={block.content.url}
                alt="preview"
                className="rounded-lg max-h-60 mx-auto object-cover"
              />
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400 text-sm">
                Image Preview Area
              </div>
            )}
          </div>
        )}

        {block.type === "markdown" && (
          <div className="grid grid-cols-2 gap-4">
            <textarea
              className="w-full h-32 p-2 bg-slate-50 text-xs font-mono rounded border-none resize-none"
              value={block.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              placeholder="# Markdown supported"
            />
            <div className="prose prose-sm overflow-auto h-32 p-2 border-l border-slate-100">
              {block.content.text || (
                <span className="text-slate-300">Preview...</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
