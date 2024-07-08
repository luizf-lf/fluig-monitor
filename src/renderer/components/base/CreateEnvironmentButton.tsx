/* eslint-disable react/require-default-props */
import { FiPlus } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

import '../../assets/styles/components/CreateEnvironmentButton.scss';

type CreateEnvironmentButtonProps = {
  isExpanded?: boolean;
};

export default function CreateEnvironmentButton({
  isExpanded = false,
}: CreateEnvironmentButtonProps) {
  const location = useLocation();

  return (
    <Link
      to="/settings/environments/new"
      className={`createEnvironmentButton ${isExpanded ? 'is-expanded' : ''} `}
      state={{ from: location.pathname }}
    >
      <FiPlus />
    </Link>
  );
}
