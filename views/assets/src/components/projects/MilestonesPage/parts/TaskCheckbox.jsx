import React, { useState } from "react";
import TaskStatusCircle from "@components/common/TaskStatusCircle";

export default function TaskCheckbox({ complete, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="shrink-0 focus:outline-none"
    >
      <TaskStatusCircle complete={complete} hovered={hovered} />
    </button>
  );
}
