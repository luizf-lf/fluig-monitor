import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function CreateAmbientView() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      CreateAmbientView.tsx
    </motion.div>
  );
}
