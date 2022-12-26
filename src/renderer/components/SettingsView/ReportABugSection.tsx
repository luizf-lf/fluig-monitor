import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function ReportABugSection() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      ReportABugSection
    </motion.div>
  );
}
