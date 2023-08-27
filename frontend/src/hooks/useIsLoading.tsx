import { useMemo } from 'react';

type LoadingStates = boolean[];

const useIsLoading = (loadingStates: LoadingStates): boolean => {
  const isLoading = useMemo(() => {
    return loadingStates.some(state => state);
  }, [loadingStates]);

  return isLoading;
};

export default useIsLoading;
