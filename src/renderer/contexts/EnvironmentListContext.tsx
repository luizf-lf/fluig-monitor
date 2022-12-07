import { createContext, ReactNode, useContext, useState } from 'react';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import { getAllEnvironments } from '../ipc/environmentsIpcHandler';

interface EnvironmentListContextProviderProps {
  children: ReactNode;
}

interface EnvironmentListContextData {
  environmentList: EnvironmentWithRelatedData[];
  updateEnvironmentList: () => void;
}

export const EnvironmentListContext = createContext(
  {} as EnvironmentListContextData
);

export function EnvironmentListContextProvider({
  children,
}: EnvironmentListContextProviderProps) {
  const [environmentList, setEnvironmentList] = useState(
    [] as EnvironmentWithRelatedData[]
  );

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
