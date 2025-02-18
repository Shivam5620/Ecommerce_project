import { Button, Modal } from "flowbite-react";
import { FC } from "react";

export interface ConfirmAlertProps {
  show: boolean;
  title: string;
  description: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

const Alert: FC<ConfirmAlertProps> = ({
  show,
  title,
  description,
  confirmButtonLabel,
  cancelButtonLabel,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal show={show} onClose={onClose} className="alert-dialog">
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body className="text-center py-4">{description}</Modal.Body>
      <Modal.Footer className="flex justify-center">
        <Button onClick={onConfirm}>{confirmButtonLabel}</Button>
        <Button onClick={onClose}>{cancelButtonLabel}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Alert;
