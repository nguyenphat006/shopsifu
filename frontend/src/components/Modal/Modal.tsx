import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Description } from '@headlessui/react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children }) => {
  return (
    <Dialog transition open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
        />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50">
        <DialogPanel transition className="max-w-lg space-y-4 bg-white p-12 rounded-lg shadow-lg">
          <DialogTitle className="font-bold text-xl">{title}</DialogTitle>
          {description && <Description className="text-gray-600">{description}</Description>}
          {children}
          <div className="flex gap-4 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy bỏ</button>
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">Xác nhận</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
