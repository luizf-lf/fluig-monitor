/* eslint-disable react/require-default-props */
import { FiAlertCircle } from 'react-icons/fi';
import '../assets/styles/components/NotificationItem.scss';

type NotificationItemProps = {
  type?: 'info' | 'success' | 'warning' | 'error';
};

function NotificationItem({ type = 'info' }: NotificationItemProps) {
  return (
    <div className={`notificationItemContainer has-${type}`}>
      <div className="iconContainer">
        <FiAlertCircle />
      </div>
      <div className="messageContainer">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus autem
        aspernatur vitae natus consequuntur esse, veritatis ipsum voluptatem,
        minima.
      </div>
    </div>
  );
}

export default NotificationItem;
