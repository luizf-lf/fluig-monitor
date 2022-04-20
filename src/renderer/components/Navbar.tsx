import { AnimatePresence, motion } from 'framer-motion';
import { useContext } from 'react';
import AmbientListContext from '../contexts/AmbientListContext';
import '../assets/styles/components/Navbar.scss';
import CreateAmbientButton from './CreateAmbientButton';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import AmbientListItem from './AmbientListItem';
import logoImage from '../assets/img/logo.png';
import { version } from '../../../release/app/package.json';

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
        <section id="logoContainer">
          <img src={logoImage} alt="Fluig Monitor" />
          <div className="logoData">
            <span className="title">Fluig Monitor</span>
            <span className="version">v{version}</span>
          </div>
        </section>
        <section id="ambientList">
          <AnimatePresence>
            {ambientList.length === 0
              ? ''
              : ambientList.map(
                  (ambient: AmbientDataInterface, idx: number) => {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: '-100px' }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            ease: 'easeInOut',
                            duration: 0.5,
                            delay: idx * 0.2,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: '-100px',
                          transition: { ease: 'easeInOut', duration: 0.3 },
                        }}
                        key={ambient.uuid}
                      >
                        <AmbientListItem
                          data={ambient}
                          key={ambient.uuid}
                          isExpanded={idx === 0}
                        />
                      </motion.div>
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