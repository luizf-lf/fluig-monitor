import { createContext } from 'react';
import dbHandler from '../../utils/dbHandler';

const AmbientListContext = createContext(dbHandler.ambients.getAll());

export default AmbientListContext;
