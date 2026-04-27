import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton
} from '@mui/material';
// Using a simple text close button instead of icon for now

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent click inside modal from closing it
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {title}
        <IconButton onClick={onClose} size="small">
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
