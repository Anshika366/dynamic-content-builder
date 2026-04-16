import React, { useEffect, useReducer, useCallback, useRef } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import Palette from "./components/Palette";
import Canvas from "./components/Canvas";
import Block from "./components/Block";

const STORAGE_KEY = "page_builder_v6_final";

function reducer(state, action) {
  switch (action.type) {
    case "ADD_BLOCK":
      return [...state, action.payload];
    case "UPDATE_BLOCK":
      return state.map((b) =>
        b.id === action.payload.id ? action.payload : b,
      );
    case "DELETE_BLOCK":
      return state.filter((b) => b.id !== action.payload);
    case "REORDER":
      return action.payload;
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

export default function App() {
  const [blocks, dispatch] = useReducer(reducer, []);
  const isLoaded = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "LOAD", payload: parsed });
        }
      } catch (e) {
        console.error("Storage error", e);
      }
    }
    isLoaded.current = true;
  }, []);

  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    }
  }, [blocks]);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;

      if (active.data.current?.fromPalette) {
        const type = active.data.current.type;
        const newBlock = {
          id: uuidv4(),
          type: type,
          content:
            type === "header"
              ? { text: "New Header", level: 1 }
              : type === "image"
                ? { url: "" }
                : { text: "" },
        };

        if (over.id === "canvas") {
          dispatch({ type: "ADD_BLOCK", payload: newBlock });
        } else {
          const overIndex = blocks.findIndex((b) => b.id === over.id);
          const newBlocks = [...blocks];
          newBlocks.splice(overIndex + 1, 0, newBlock);
          dispatch({ type: "REORDER", payload: newBlocks });
        }
        return;
      }

      if (active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch({
            type: "REORDER",
            payload: arrayMove(blocks, oldIndex, newIndex),
          });
        }
      }
    },
    [blocks],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex bg-slate-50 h-screen w-full overflow-hidden font-sans">
        <Palette />
        <Canvas blocks={blocks}>
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block) => (
              <Block key={block.id} block={block} dispatch={dispatch} />
            ))}
          </SortableContext>
        </Canvas>
      </div>
    </DndContext>
  );
}
