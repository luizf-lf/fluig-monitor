import { createContext, ReactNode, useContext, useState } from 'react';
import { Environment } from '../../main/generated/client';
import { getAllEnvironmentsIPC } from '../utils/ipcHandler';

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

export async function EnvironmentListContextProvider({
  children,
}: EnvironmentListContextProviderProps) {
  const [environmentList, setEnvironmentList] = useState(
    await getAllEnvironmentsIPC()
  );

  async function updateEnvironmentList() {
    setEnvironmentList(await getAllEnvironmentsIPC());
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
