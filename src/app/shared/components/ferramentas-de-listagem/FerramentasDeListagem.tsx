import { Box, Button, Icon, InputAdornment, Paper, TextField, useTheme } from "@mui/material";

import { Environment } from "../../environments";

interface IFerramentasDeListagemProps {

    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarEmNovo?: () => void;

}

export const FerramentasDeListagem: React.FC<IFerramentasDeListagemProps> = ({
    textoDaBusca = "",
    mostrarInputBusca = false,
    aoMudarTextoDeBusca,
    aoClicarEmNovo,
    textoBotaoNovo = "Novo",
    mostrarBotaoNovo = true,
}) => {

    const theme = useTheme();

    return(
        <Box 
            height={theme.spacing(5)}
            marginX={1}
            padding={1}
            paddingX={2}
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
            component={Paper}
        >
            {mostrarInputBusca && (
                <TextField 
                    size="small"
                    value={textoDaBusca}
                    placeholder={Environment.INPUT_DE_BUSCA}
                    onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>search</Icon>
                          </InputAdornment>
                        ),
                    }}
                />
            )}

            {mostrarBotaoNovo && (
                <Button
                    color="primary"
                    disableElevation
                    variant="contained"
                    onClick={aoClicarEmNovo}
                    endIcon={<Icon>add</Icon>}
                >
                    {textoBotaoNovo}
                </Button>
            )}
        </Box>
    );

};