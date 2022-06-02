import { FiSettings, FiSun } from 'react-icons/fi';
import '../../assets/styles/components/Navbar/RightButtons.scss';

function RightButtons() {
  return (
    <section id="rightButtons">
      {/* TODO: Create theme context switcher */}
      <button type="button" className="optionButton">
        <FiSun />
      </button>
      {/* TODO: Create options modal */}
      <button type="button" className="optionButton">
        <FiSettings />
      </button>
    </section>
  );
}

export default RightButtons;
