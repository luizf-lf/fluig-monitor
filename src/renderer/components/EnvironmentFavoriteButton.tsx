import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { toggleEnvironmentFavorite } from '../ipc/environmentsIpcHandler';

interface Props {
  environmentId: number;
  isFavorite: boolean;
}

export default function EnvironmentFavoriteButton({
  environmentId,
  isFavorite,
}: Props) {
  const { createShortNotification } = useNotifications();
  const { updateEnvironmentList } = useEnvironmentList();
  const [favoriteStar, setFavoriteStar] = useState(
    isFavorite ? <AiFillStar /> : <AiOutlineStar />
  );

  const { t } = useTranslation();

  async function toggleFavoriteEnvironment(id: number) {
    const { favorited, exception } = await toggleEnvironmentFavorite(id);

    if (exception === 'MAX_FAVORITES_EXCEEDED') {
      createShortNotification({
        id: Date.now(),
        message: t('helpMessages.environments.maximumExceeded'),
        type: 'warning',
      });

      return;
    }

    if (favorited) {
      createShortNotification({
        id: Date.now(),
        message: t('helpMessages.environments.added'),
        type: 'success',
      });
      setFavoriteStar(<AiFillStar />);
    } else {
      createShortNotification({
        id: Date.now(),
        message: t('helpMessages.environments.removed'),
        type: 'success',
      });
      setFavoriteStar(<AiOutlineStar />);
    }

    updateEnvironmentList();
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavoriteEnvironment(environmentId)}
    >
      {favoriteStar}
    </button>
  );
}
