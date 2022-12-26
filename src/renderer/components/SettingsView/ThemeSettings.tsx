import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function ThemeSettings() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      ThemeSettings
    </motion.div>
  );
}
