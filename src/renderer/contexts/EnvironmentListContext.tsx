import { createContext, ReactNode, useContext, useState } from 'react';
import { Environment } from '../../main/generated/client';
import { getAllEnvironments } from '../ipc/ipcHandler';

// const EnvironmentListContext = createContext(dbHandler.environments.getAll());

// export default EnvironmentListContext;

interface EnvironmentListContextProviderProps {
  children: ReactNode;
}

interface EnvironmentListContextData {
  environmentList: Environment[];
  updateEnvironmentList: () => void;
}

export const EnvironmentListContext = createContext(
  {} as EnvironmentListContextData
);

export function EnvironmentListContextProvider({
  children,
}: EnvironmentListContextProviderProps) {
  const [environmentList, setEnvironmentList] = useState([] as Environment[]);

  async function updateEnvironmentList() {
    setEnvironmentList(await getAllEnvironments());
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
