import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import CreateEnvironmentButton from '../components/CreateEnvironmentButton';
import EnvironmentListContext from '../contexts/EnvironmentListContext';

import globalContainerVariants from '../../utils/globalContainerVariants';
import '../assets/styles/Views/HomeAmbientListView.scss';
import colorServer from '../assets/svg/color-server.svg';

function HomeAmbientListView() {
  const [environmentList] = useContext(EnvironmentListContext);
  const { t } = useTranslation();

  const createAmbientHelper = (
    <div className="createAmbientCard">
      <div className="chevron">
        <FiChevronLeft />
      </div>
      <div className="info">
        <img src={colorServer} alt="Server" />
        <span>{t('views.HomeAmbientListView.createAmbientHelper')}</span>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="homeAmbientListContainer"
    >
      <h2>{t('views.HomeAmbientListView.header')}</h2>
      <div id="ambientListContent">
        <CreateEnvironmentButton isExpanded />
        {/* // TODO: map environment list */}
        {environmentList.length === 0 ? createAmbientHelper : <div>lista</div>}
      </div>
    </motion.div>
  );
}

export default HomeAmbientListView;
