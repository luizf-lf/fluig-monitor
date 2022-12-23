import { motion } from 'framer-motion';
import globalContainerVariants from '../utils/globalContainerVariants';

export default function AppSettingsView() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="appSettingsContainer"
      className="app-settings-container"
    >
      Settings
    </motion.div>
  );
}
