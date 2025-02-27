import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { type ReactNode } from "react";
import { Button } from "./ui/button";

interface CustomDialogProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  triggerText: string | ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function CustomDialog({
  open,
  setOpen,
  triggerText,
  title,
  description,
  children,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="-top-[10px] relative">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (setOpen ? setOpen(false) : undefined)}
            >
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
