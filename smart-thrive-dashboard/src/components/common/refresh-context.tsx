import React, {createContext, useContext, useState} from 'react';

type RefreshContextType = {
    refresh: () => void;
    setRefresh: React.Dispatch<React.SetStateAction<() => void>>;
};

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [refresh, setRefresh] = useState<() => void>(() => () => {
    });

    return (
        <RefreshContext.Provider value={{refresh, setRefresh}}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefresh must be used within a RefreshProvider');
    }
    return context;
};
