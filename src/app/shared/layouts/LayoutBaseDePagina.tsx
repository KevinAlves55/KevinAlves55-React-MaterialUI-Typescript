import { ReactNode } from "react";
import { Icon, IconButton, Typography, useMediaQuery, useTheme, AppBar, Container, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import AdbIcon from "@mui/icons-material/Adb";
import { useDrawerContext } from "../contexts";

interface ILayoutBaseDePaginaProps {

    children: React.ReactNode;
    titulo: string;
    barraDeFerramentas?: ReactNode;

}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down("sm"));
    const mdDown = useMediaQuery(theme.breakpoints.down("md"));

    const { toggleDrawerOpen } = useDrawerContext();

    return (
        <Box height="100%" display="flex" flexDirection="column" gap={2}>
            <AppBar
                position="static"
            >
                <Container maxWidth="xl">
                    <Toolbar>
                        {smDown && (
                            <IconButton onClick={toggleDrawerOpen}>
                                <Icon>menu</Icon>
                            </IconButton>
                        )}

                        <AdbIcon
                            sx={{ display: { xs: "none", md: "flex" }, mr: 2, fontSize: 35 }}
                        />

                        <Typography
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipes"
                            variant={smDown ? "h6" : mdDown ? "h5" : "h4"}
                            noWrap
                            sx={{
                                mr: 2,
                                fontWeight: 500,
                                color: "inherit",
                                textDecoration: "none"
                            }}
                        >
                            {titulo}
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>

            {barraDeFerramentas &&
                (<Box>
                    {barraDeFerramentas}
                </Box>)}

            <Box flex={1} overflow="auto">
                {children}
            </Box>
        </Box>
    );

};