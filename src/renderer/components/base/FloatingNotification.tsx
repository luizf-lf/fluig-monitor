/* eslint-disable react/require-default-props */
import { motion } from 'framer-motion';
import {
  FiAlertCircle,
  FiAlertOctagon,
  FiCheck,
  FiInfo,
  FiX,
} from 'react-icons/fi';
import '../../assets/styles/components/FloatingNotification.scss';

type FloatingNotificationProps = {
  type?: string;
  message: string;
  mustManuallyClose?: boolean;
};

function FloatingNotification({
  type = 'info',
  message,
  mustManuallyClose = false,
}: FloatingNotificationProps) {
  let icon = <></>;
  const animationVariants = {
    hidden: {
      opacity: 0,
      x: '50vw',
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ease: 'easeInOut', duration: 0.5 },
    },
    exit: {
      opacity: 0,
      x: '50vw',
      transition: { ease: 'easeInOut', duration: 0.5 },
    },
  };

  switch (type) {
    case 'success':
      icon = <FiCheck />;
      break;
    case 'warning':
      icon = <FiAlertCircle />;
      break;
    case 'error':
      icon = <FiAlertOctagon />;
      break;
    default:
      icon = <FiInfo />;
      break;
  }
  return (
    <motion.div
      className={`floatingNotificationContainer has-${type}`}
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="iconContainer">{icon}</div>
      <div className="messageContainer">{message}</div>
      {mustManuallyClose ? (
        <button className="closeButtonContainer" type="button">
          <FiX />
        </button>
      ) : (
        <></>
      )}
    </motion.div>
  );
}

export default FloatingNotification;
