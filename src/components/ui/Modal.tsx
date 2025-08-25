import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { CSSTransition } from 'react-transition-group';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // We need to ensure the modal root exists
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="modal-transition"
      unmountOnExit
    >
      <FocusTrap active={isOpen}>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 modal-overlay"
            onClick={onClose}
          ></div>

          {/* Modal Panel */}
          <div className="relative bg-bg-light rounded-lg shadow-lift-md m-4 w-full max-w-lg modal-content">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-deep-teal">{title}</h3>
              <button
                type="button"
                className="text-neutral bg-transparent hover:bg-gray-200 hover:text-deep-teal rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
                {footer}
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </CSSTransition>,
    modalRoot
  );
};

export default Modal;
