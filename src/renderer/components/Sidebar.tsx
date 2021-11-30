import '../assets/styles/components/Sidebar.scss';
import { motion } from 'framer-motion';
import SidebarFooter from './SidebarFooter';
import SidebarContent from './SidebarContent';

export default function Sidebar(): JSX.Element {
  return (
    <motion.div
      id="sidebarContainer"
      animate={{ x: 0 }}
      transition={{ from: -400, ease: 'easeInOut', duration: 0.75 }}
    >
      <SidebarContent />
      <SidebarFooter />
    </motion.div>
  );
}
