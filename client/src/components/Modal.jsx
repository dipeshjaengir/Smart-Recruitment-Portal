import React from 'react';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className={`w-full ${maxWidth} glass-panel border border-indigo-500/20 bg-[#0c101d] overflow-hidden shadow-2xl relative z-10 flex flex-col`}
          >
            <div className="px-6 py-4 border-b border-indigo-500/10 flex items-center justify-between">
              <h3 className="font-semibold text-lg tracking-tight text-gradient-cyan">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
