import { Api } from "./../axios-config/index";

interface IAuth {

    accessToken: string;

} 

const auth = async (email: string, password: string): Promise<IAuth | Error> => {

    try {
        
        const { data } = await Api.get("/auth", { data: { email, password } });

        if (data) {
            return data;
        }

        return new Error("Falha na autenticação");

    } catch (error) {
        
        console.log(error);
        return new Error((error as { message: string }).message || "Falha na autenticação");

    }

};

export const AuthService = {
    auth
};