import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.jsx";
import {Button} from "@/components/custom/button.jsx";
import {useEffect} from "react";

const DeleteConfirmationModal = (
  {
    open,
    setOpen,
    handleClose,
    handleDelete,
    dialogTitle,
    dialogParagraph,
    showCancel = true,
    confirmText,
    cancelText,
    dialogContentProps,
    loading = false
  }
) => {

  let dialog_title = dialogTitle || "O'chirish"
  let dialog_paragraph = dialogParagraph || "Ishonchingiz komilmi?"
  let cancel_text = cancelText || "Bekor qilish"
  let confirm_text = confirmText || "O'chirish"

  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "auto";
    }
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
      setOpen(open);
    }}>
      <DialogContent {...dialogContentProps}>
        <DialogHeader>
          <DialogTitle>{dialog_title}</DialogTitle>
        </DialogHeader>
        <p>{dialog_paragraph}</p>
        <div className="flex justify-end gap-2 mt-3">
          {!!showCancel && (
            <Button variant={"secondary"} onClick={handleClose}>
              {cancel_text}
            </Button>
          )}
          <Button variant={"destructive"} loading={loading} onClick={handleDelete}>{confirm_text}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal