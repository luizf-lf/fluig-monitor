import { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import '../assets/styles/components/SidebarContent.scss';
import CreateAmbientButton from './CreateAmbientButton';
import AmbientListItem from './AmbientListItem';
import AmbientListContext from '../contexts/AmbientListContext';

export default function SidebarContent(): JSX.Element {
  const [ambientList] = useContext(AmbientListContext);

  return (
    <div id="SidebarContentContainer">
      <div id="title">
        <h3>Seus ambientes</h3>
      </div>
      <section id="ambientList">
        <AnimatePresence>
          {ambientList.length === 0 ? (
            <motion.span
              style={{ color: 'var(--fade)' }}
              initial={{ opacity: 0, x: '-100px' }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { ease: 'easeInOut', duration: 1 },
              }}
              exit={{ opacity: 0, x: '-100px' }}
              key="EMPTY_AMBIENT_LIST_ITEM"
            >
              Nenhum ambiente cadastrado.
            </motion.span>
          ) : (
            ambientList.map((ambient: AmbientDataInterface) => (
              <motion.div
                initial={{ opacity: 0, scale: '75%' }}
                animate={{
                  opacity: 1,
                  scale: '100%',
                  transition: { ease: 'easeInOut', duration: 0.5 },
                }}
                exit={{
                  opacity: 0,
                  x: '-300px',
                  transition: { ease: 'easeInOut', duration: 0.3 },
                }}
                key={ambient.uuid}
              >
                <AmbientListItem data={ambient} />
              </motion.div>
            ))
          )}
          <CreateAmbientButton />
        </AnimatePresence>
      </section>
    </div>
  );
}
