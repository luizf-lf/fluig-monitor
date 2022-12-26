import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function GitHubSection() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      GitHubSection
    </motion.div>
  );
}
