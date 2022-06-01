import { createContext } from 'react';
import dbHandler from '../../utils/dbHandler';

const EnvironmentListContext = createContext(dbHandler.environments.getAll());

export default EnvironmentListContext;
