import { __ } from '@wordpress/i18n';
import React, { useState } from "react";
import TaskStatusCircle from "@components/common/TaskStatusCircle";

export default function TaskCheckbox({ complete, onClick, taskTitle = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="shrink-0 focus:outline-none"
      aria-pressed={complete}
      aria-label={(complete
        ? __('Mark "%s" incomplete', 'wedevs-project-manager')
        : __('Mark "%s" complete', 'wedevs-project-manager')).replace('%s', taskTitle)}
    >
      <TaskStatusCircle complete={complete} hovered={hovered} />
    </button>
  );
}
