import { useState } from "react";
import { Card, CardActions, CardContent, Box, Button, Typography, TextField, LinearProgress, CircularProgress } from "@mui/material";
import * as yup from "yup";

import { useAuthContext } from "../../contexts";

const loginSchema = yup.object().shape({

    email: yup.string().email().required(),
    password: yup.string().required().min(5),

});

interface ILoginProps {

    children: React.ReactNode;

}

export const Login: React.FC<ILoginProps> = ({ children }) => {

    const { isAuthenticated, login } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = () => {

        setIsLoading(true);

        loginSchema
        .validate({ email, password }, { abortEarly: false })

        .then(dadosValidados => {
            login(dadosValidados.email, dadosValidados.password)
            .then(() => {
                setIsLoading(false);
            });
        })

        .catch((errors: yup.ValidationError) => {

            errors.inner.forEach(error => {

                if (error.path === "email") {
                  
                    setEmailError(error.message);

                } else if (error.path === "password") {
                    
                    setPasswordError(error.message);
                
                }
            
            });

        });

    };

    if (isAuthenticated) return (
        <>{children}</>
    );

    return(

        <Box 
            width="100vw"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Card>
                {isLoading && (
                    <LinearProgress variant="indeterminate"/>
                )}
                <CardContent>
                    <Box display="flex" flexDirection="column" gap={2} width={250}>
                        <Typography variant="h6" align="center">Identifique-se</Typography>

                        <TextField 
                            label="Email"
                            placeholder="Ex: meu@gmail.com"
                            type="email"
                            fullWidth
                            value={email}
                            onKeyDown={() => setEmailError("")}
                            onChange={e => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            disabled={isLoading}
                        />
                        <TextField 
                            label="Senha"
                            type="password"
                            fullWidth
                            value={password}
                            onKeyDown={() => setPasswordError("")}
                            onChange={e => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            disabled={isLoading}
                        />
                    </Box>
                </CardContent>

                <CardActions>
                    <Box width="100%" display="flex" justifyContent="center">
                        <Button 
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            endIcon={
                                isLoading ? <CircularProgress 
                                    variant="indeterminate"
                                    size={20}
                                    color="inherit"
                                /> : undefined
                            }
                        >
                            Entrar
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </Box>

    );

};