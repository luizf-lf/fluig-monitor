import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function LanguageSettings() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      LanguageSettings
    </motion.div>
  );
}
