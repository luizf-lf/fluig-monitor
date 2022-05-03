import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext } from 'react';
import EnvironmentListContext from '../contexts/EnvironmentListContext';
import '../assets/styles/components/Navbar.scss';
import CreateEnvironmentButton from './CreateEnvironmentButton';
import EnvironmentDataInterface from '../interfaces/EnvironmentDataInterface';
import EnvironmentListItem from './EnvironmentListItem';
import logoImage from '../assets/img/logo.png';
import defaultUserProfile from '../assets/img/default-user-profile.png';
import { version } from '../../../release/app/package.json';

function Navbar() {
  const [environmentList] = useContext(EnvironmentListContext);

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
          <img src={logoImage} alt="Fluig Monitor" />
          <div className="logoData">
            <span className="title">Fluig Monitor</span>
            <span className="version">v{version}</span>
          </div>
        </Link>
        <section id="environmentList">
          <AnimatePresence>
            {environmentList.length === 0
              ? ''
              : environmentList.map(
                  (environment: EnvironmentDataInterface, idx: number) => {
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
                        key={environment.uuid}
                      >
                        <EnvironmentListItem
                          data={environment}
                          key={environment.uuid}
                          isExpanded={idx === 0}
                        />
                      </motion.div>
                    );
                  }
                )}
            <CreateEnvironmentButton />
          </AnimatePresence>
        </section>
      </div>
      <div>
        <section id="user-profile">
          <div className="user-info">
            <span className="name">Johnny Silverhand</span>
            <span className="role">admin</span>
          </div>
          <img src={defaultUserProfile} alt="User" />
        </section>
      </div>
    </motion.nav>
  );
}

export default Navbar;
