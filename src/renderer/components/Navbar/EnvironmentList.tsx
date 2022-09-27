import { motion } from 'framer-motion';
import { Environment } from '../../../main/generated/client';
import EnvironmentListItem from './EnvironmentListItem';

type EnvironmentListProps = {
  environmentList: Environment[];
};

function EnvironmentList({ environmentList }: EnvironmentListProps) {
  return environmentList.length === 0 ? (
    <></>
  ) : (
    <>
      {environmentList.map((environment: Environment, idx: number) => {
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
            key={environment.id}
          >
            <EnvironmentListItem
              data={environment}
              key={environment.id}
              isExpanded={idx === 0}
            />
          </motion.div>
        );
      })}
    </>
  );
}

export default EnvironmentList;
