import { Button, Icon, Paper, TextField, useTheme } from "@mui/material";
import { Box } from "@mui/system";

interface IBarraDeFerramentasProps {

    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarEmNovo?: () => void;

}

export const BarraDeFerramentas: React.FC<IBarraDeFerramentasProps> = ({
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
                    placeholder="Pesquisar..."
                    onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
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