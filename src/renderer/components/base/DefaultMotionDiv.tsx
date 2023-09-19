import { ReactNode } from 'react';
import { motion } from 'framer-motion';

import globalContainerVariants from '../../utils/globalContainerVariants';

interface Props {
  children: ReactNode;
  id: string;
}

/**
 * A framer motion with the default animation from globalContainerVariants
 */
function DefaultMotionDiv({ children, id }: Props) {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id={id}
    >
      {children}
    </motion.div>
  );
}

export default DefaultMotionDiv;
