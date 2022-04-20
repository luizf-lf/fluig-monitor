import { AnimatePresence, motion } from 'framer-motion';
import { useContext } from 'react';
import AmbientListContext from '../contexts/AmbientListContext';
import '../assets/styles/components/Navbar.scss';
import CreateAmbientButton from './CreateAmbientButton';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import AmbientListItem from './AmbientListItem';

function Navbar() {
  const [ambientList] = useContext(AmbientListContext);
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
        <section id="logoContainer">{/* Logo */}</section>
        <section id="ambientList">
          <AnimatePresence>
            {ambientList.length === 0
              ? ''
              : ambientList.map(
                  (ambient: AmbientDataInterface, idx: number) => {
                    return (
                      <AmbientListItem
                        data={ambient}
                        key={ambient.uuid}
                        isExpanded={idx === 0}
                      />
                    );
                  }
                )}
            <CreateAmbientButton />
          </AnimatePresence>
        </section>
      </div>
      <div>{/* User Profile */}</div>
    </motion.nav>
  );
}

export default Navbar;
