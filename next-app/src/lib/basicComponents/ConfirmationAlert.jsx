"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import SpinnerLoading from "./SpinnerLoading";

export default function ConfirmationAlert({
  message,
  description,
  cancelText,
  triggerElement,
  mutationFn,
  toastError,
  toastSucces,
  onSuccesCustomFunc,
  parentDialogCloser,
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const propMutation = useMutation({
    mutationFn: async () => {
      await mutationFn();
    },
    onError: () => {
      // console.log('Error occurred:', error)
      setIsAlertDialogOpen(false);
      if (parentDialogCloser) parentDialogCloser();
      toast(toastError);
    },
    onSuccess: () => {
      // console.log('mutation worked')
      setIsAlertDialogOpen(false);
      if (parentDialogCloser) parentDialogCloser();
      toast(toastSucces);
      if (onSuccesCustomFunc) onSuccesCustomFunc();
    },
  });

  const handleConfirm = async () => {
    await propMutation.mutateAsync();
    setIsAlertDialogOpen(false);
  };

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
            {cancelText}
          </AlertDialogCancel>
          {propMutation.isPending ? (
            <Button disabled={propMutation.isPending}>
              <SpinnerLoading />
            </Button>
          ) : (
            <div onClick={handleConfirm}>{triggerElement}</div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
