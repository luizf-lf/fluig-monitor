import { AnimatePresence } from 'framer-motion';
import { createContext, ReactNode, useContext, useState } from 'react';
import FloatingNotification from '../components/FloatingNotification';

interface NotificationInterface {
  id: number;
  type: string;
  message: string;
}

interface NotificationsContextProviderProps {
  children: ReactNode;
}
interface NotificationsContextData {
  notificationList: NotificationInterface[];
  createNotification: ({ id, type, message }: NotificationInterface) => void;
  createShortNotification: ({
    id,
    type,
    message,
  }: NotificationInterface) => void;
  removeNotification: (id: number) => void;
}

export const NotificationsContext = createContext(
  {} as NotificationsContextData
);

export function NotificationsContextProvider({
  children,
}: NotificationsContextProviderProps) {
  const [notificationList, setNotificationList] = useState(
    [] as NotificationInterface[]
  );

  function createNotification({ id, type, message }: NotificationInterface) {
    setNotificationList((prevNotifications) => [
      ...prevNotifications,
      {
        id,
        type,
        message,
      },
    ]);
  }

  function removeNotification(id: number) {
    const notificationIndex = notificationList.findIndex(
      (item) => item.id === id
    );
    if (notificationIndex > -1) {
      setNotificationList(notificationList.splice(notificationIndex));
    }
  }

  function createShortNotification(
    { id, type, message }: NotificationInterface,
    timeout = 5000
  ) {
    createNotification({ id, type, message });
    setTimeout(() => {
      // removeNotification(id);
      setNotificationList(notificationList.slice(1, notificationList.length));
    }, timeout);
  }

  return (
    <NotificationsContext.Provider
      value={{
        notificationList,
        createNotification,
        removeNotification,
        createShortNotification,
      }}
    >
      {children}
      <div id="floatingNotificationsContainer">
        <AnimatePresence>
          {notificationList.map(({ id, type, message }) => {
            return (
              <FloatingNotification key={id} type={type} message={message} />
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  return useContext(NotificationsContext);
};
