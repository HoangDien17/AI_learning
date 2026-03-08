import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Heart className="h-10 w-10 text-primary-500" fill="currentColor" />
      </motion.div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}
