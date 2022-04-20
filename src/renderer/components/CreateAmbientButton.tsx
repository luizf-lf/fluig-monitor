import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../assets/styles/components/CreateAmbientButton.scss';

export default function CreateAmbientButton() {
  return (
    <Link to="/settings/ambients/new" id="createAmbientButton">
      <FiPlus />
    </Link>
  );
}
