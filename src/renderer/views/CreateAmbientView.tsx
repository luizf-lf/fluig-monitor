import { motion } from 'framer-motion';

export default function CreateAmbientView() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ from: 0, ease: 'easeInOut', duration: 0.3 }}
    >
      aaa
    </motion.div>
  );
}
