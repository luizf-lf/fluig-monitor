import { motion } from 'framer-motion';
import EnvironmentDataInterface from '../../../common/interfaces/EnvironmentDataInterface';
import EnvironmentListItem from './EnvironmentListItem';

// TODO: Fix EnvironmentList as undefined
type EnvironmentListProps = {
  environmentList: EnvironmentDataInterface[];
};

function EnvironmentList({ environmentList }: EnvironmentListProps) {
  return environmentList.length === 0 ? (
    <></>
  ) : (
    <>
      {environmentList.map(
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
    </>
  );
}

export default EnvironmentList;
