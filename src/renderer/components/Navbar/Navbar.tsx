import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEnvironmentList } from '../../contexts/EnvironmentListContext';
import CreateEnvironmentButton from '../CreateEnvironmentButton';
import EnvironmentList from './EnvironmentList';

import '../../assets/styles/components/Navbar.scss';
import Logo from './Logo';
import NavActionButtons from './NavActionButtons';

function Navbar() {
  const { environmentList } = useEnvironmentList();

  return (
    <motion.nav
      initial={{ opacity: 0, y: '-50px' }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { ease: 'easeInOut', duration: 0.5 },
      }}
      id="mainNavbar"
    >
      <div>
        <Link to="/" id="logo-container">
          <Logo />
        </Link>
        <section id="environmentList">
          <AnimatePresence>
            <EnvironmentList environmentList={environmentList} />
            <CreateEnvironmentButton key="ADD_ENVIRONMENT_BUTTON" />
          </AnimatePresence>
        </section>
      </div>
      <NavActionButtons />
    </motion.nav>
  );
}

export default Navbar;
