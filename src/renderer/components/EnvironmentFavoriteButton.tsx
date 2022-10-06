import { useState } from 'react';
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

  async function toggleFavoriteEnvironment(id: number) {
    const { favorited, exception } = await toggleEnvironmentFavorite(id);

    if (exception === 'MAX_FAVORITES_EXCEEDED') {
      createShortNotification({
        id: Date.now(),
        message: 'Você só pode favoritar até 3 ambientes',
        type: 'warning',
      });

      return;
    }

    if (favorited) {
      createShortNotification({
        id: Date.now(),
        message: 'Ambiente adicionado aos favoritos',
        type: 'success',
      });
      setFavoriteStar(<AiFillStar />);
    } else {
      createShortNotification({
        id: Date.now(),
        message: 'Ambiente removido dos favoritos',
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
