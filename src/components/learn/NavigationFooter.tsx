'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ButtonVariant } from '@/types/ui';

const NavigationFooter = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="pt-8 border-t border-gray-200 flex gap-4"
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
        <Link href="/student-dashboard/my-courses">
          <Button fullWidth variant={ButtonVariant.Secondary}>
            Back to Courses
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
});

NavigationFooter.displayName = 'NavigationFooter';

export default NavigationFooter;
