import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "../services/api/auth/AuthService";

interface TAuthContextData {

    isAuthenticated: boolean;
    logout: () => void;
    login: (email: string, password: string) => Promise<string | void>;

}

const AuthContext = createContext({} as TAuthContextData);

const LOCAL_STORAGE_KEY__ACCESS_TOKEN = "APP_ACCESS_TOKEN";

interface AuthProvider {
    children: React.ReactNode;
}

export const useAuthContext = () => {

    return useContext(AuthContext);

};

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {

    const [accessToken, setAccessToken] = useState<string>();

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);

        if (accessToken) {
            setAccessToken(JSON.parse(accessToken));
        } else {
            setAccessToken(undefined);
        }

    }, []);

    const handleLogin = useCallback(async (email: string, password: string) => {

        const result = await AuthService.auth(email, password);

        if (result instanceof Error) {
            return result.message;
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify(result.accessToken));
            setAccessToken(result.accessToken);
        }

    }, []);

    const handleLogout = useCallback(() => {
        setAccessToken(undefined);
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    }, []);

    const isAuthenticated = useMemo(() => !!accessToken,[accessToken]);

    return(

        <AuthContext.Provider value={{ 
            isAuthenticated: isAuthenticated, 
            login: handleLogin, 
            logout: handleLogout 
        }}>
            {children}
        </AuthContext.Provider>

    );

};