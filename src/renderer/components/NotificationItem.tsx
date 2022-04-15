/* eslint-disable react/require-default-props */
import {
  FiAlertCircle,
  FiAlertOctagon,
  FiCheck,
  FiInfo,
  FiX,
} from 'react-icons/fi';
import '../assets/styles/components/NotificationItem.scss';

type FloatingNotificationProps = {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  mustManuallyClose?: boolean;
};

function FloatingNotification({
  type = 'info',
  message,
  mustManuallyClose = false,
}: FloatingNotificationProps) {
  let icon = <></>;

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
    <div className={`floatingNotificationContainer has-${type}`}>
      <div className="iconContainer">{icon}</div>
      <div className="messageContainer">{message}</div>
      {mustManuallyClose ? (
        <button className="closeButtonContainer" type="button">
          <FiX />
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default FloatingNotification;
