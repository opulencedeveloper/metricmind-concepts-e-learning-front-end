'use client';

import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { LogoutConfirmationModalProps } from '@/types/modal';

export default function LogoutConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} closeOnBackdropClick={!isLoading}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Icon Section */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 p-6 flex justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="p-6 text-center space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
          <p className="text-sm text-gray-600">
            Are you sure you want to sign out? You'll need to log in again to access your courses.
          </p>
        </motion.div>

        {/* Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="px-6 pb-6 space-y-3"
        >
          {/* Confirm Button */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Sign Out
              </>
            )}
          </motion.button>

          {/* Cancel Button */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={onCancel}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-2.5 hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </motion.button>
        </motion.div>
      </motion.div>
    </Modal>
  );
}
