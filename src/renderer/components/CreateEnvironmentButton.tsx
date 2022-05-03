import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../assets/styles/components/CreateEnvironmentButton.scss';

export default function CreateEnvironmentButton() {
  return (
    <Link to="/settings/environments/new" id="createEnvironmentButton">
      <FiPlus />
    </Link>
  );
}
