import { createContext, ReactNode, useContext, useState } from 'react';
import EnvironmentDataInterface from '../../common/interfaces/EnvironmentDataInterface';
import dbHandler from '../utils/dbHandler';

// const EnvironmentListContext = createContext(dbHandler.environments.getAll());

// export default EnvironmentListContext;

interface EnvironmentListContextProviderProps {
  children: ReactNode;
}

interface EnvironmentListContextData {
  environmentList: EnvironmentDataInterface[];
  updateEnvironmentList: () => void;
}

export const EnvironmentListContext = createContext(
  {} as EnvironmentListContextData
);

export function EnvironmentListContextProvider({
  children,
}: EnvironmentListContextProviderProps) {
  const [environmentList, setEnvironmentList] = useState(
    dbHandler.environments.getAll()
  );

  function updateEnvironmentList() {
    setEnvironmentList(dbHandler.environments.getAll());
  }

  return (
    <EnvironmentListContext.Provider
      value={{
        environmentList,
        updateEnvironmentList,
      }}
    >
      {children}
    </EnvironmentListContext.Provider>
  );
}

export const useEnvironmentList = () => {
  return useContext(EnvironmentListContext);
};
