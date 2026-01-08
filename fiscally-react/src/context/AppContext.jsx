import { createContext, useState } from "react";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const clearUser = () =>{
        setUser(null);
    }

    const contextValue = {
        user, 
        setUser,
        clearUser
    }

    return (
        <AppContext.Provider value={{ user, setUser, clearUser }}>
        {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
