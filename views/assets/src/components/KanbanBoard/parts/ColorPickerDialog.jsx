import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { ColorPicker } from "@components/ui/color-picker";

export default function ColorPickerDialog({ open, onOpenChange, currentColor, onSelect }) {
  const [draft, setDraft] = useState(currentColor || "");

  useEffect(() => {
    if (open) setDraft(currentColor || "");
  }, [open, currentColor]);

  const apply = () => {
    onSelect(draft || "");
    onOpenChange(false);
  };

  const remove = () => {
    onSelect("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px]" data-pm-dialog>
        <DialogHeader>
          <DialogTitle>{__("Background Color", 'wedevs-project-manager')}</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <ColorPicker
            value={draft}
            onChange={(c) => setDraft(c || "")}
            className="w-full justify-start"
          />
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={remove}>
            {__("Remove Color", 'wedevs-project-manager')}
          </Button>
          <Button type="button" size="sm" onClick={apply}>
            {__("Apply", 'wedevs-project-manager')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
