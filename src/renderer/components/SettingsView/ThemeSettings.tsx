/* eslint-disable jsx-a11y/label-has-associated-control */
import { motion } from 'framer-motion';
import { FiPenTool } from 'react-icons/fi';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function ThemeSettings() {
  const theme = document.body.classList.contains('dark-theme')
    ? 'DARK'
    : 'WHITE';

  // TODO: Update with preview selector (resources at renderer/assets/img/)
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3>
        <FiPenTool /> Tema
      </h3>
      <p>Selecione abaixo o tema que deverá ser utilizado pela aplicação:</p>

      <div className="form-group">
        <select
          name="appTheme"
          id="appTheme"
          defaultValue={theme}
          onChange={(event) => {
            console.log(event.target.value);
          }}
        >
          <option value="WHITE">Claro</option>
          <option value="DARK">Escuro</option>
        </select>
      </div>
    </motion.div>
  );
}
