import { __ } from '@wordpress/i18n';
import React, { useState } from "react";
import { extractDateStr } from "@lib/pm-utils";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { DialogFooter } from "@components/ui/dialog";
import RichTextEditor from "@components/common/RichTextEditor";

export default function MilestoneForm({ milestone, onSubmit, onCancel }) {
  const [title, setTitle] = useState(milestone?.title || "");
  const [description, setDescription] = useState(
    milestone?.description?.content || milestone?.description || "",
  );
  const [achieveDate, setAchieveDate] = useState(
    extractDateStr(milestone?.achieve_date) || "",
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      achieve_date: achieveDate || undefined,
      status: milestone?.status ?? "incomplete",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>{__("Title", 'wedevs-project-manager')}</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={__("Milestone title", 'wedevs-project-manager')}
          autoFocus
        />
      </div>
      <div className="space-y-1.5">
        <Label>{__("Description", 'wedevs-project-manager')}</Label>
        <RichTextEditor
          content={description}
          onChange={setDescription}
          placeholder={__("Description...", 'wedevs-project-manager')}
          minHeight="80px"
        />
      </div>
      <div className="space-y-1.5">
        <Label>{__("Target Date", 'wedevs-project-manager')}</Label>
        <Input
          type="date"
          value={achieveDate}
          onChange={(e) => setAchieveDate(e.target.value)}
          className="w-full sm:w-[200px]"
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {__("Cancel", 'wedevs-project-manager')}
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {milestone ? __("Update", 'wedevs-project-manager') : __("Create Milestone", 'wedevs-project-manager')}
        </Button>
      </DialogFooter>
    </form>
  );
}
