import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { CidadesService } from "../../shared/services/api/cidades/CidadesService";

export const Dashborad: React.FC = () => {

    const [isLoadingCidades, setIsLoadingCidades] = useState(true);
    const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
    const [totalCountPessoas, setTotalCountPessoas] = useState(0);
    const [totalCountCidades, setTotalCountCidades] = useState(0);

    useEffect(() => {

        setIsLoadingCidades(true);
        setIsLoadingPessoas(true);

        PessoasService.getAll().then((result) => {

            setIsLoadingPessoas(false);

            if (result instanceof Error) {

                alert(result.message);

            } else {

                setTotalCountPessoas(result.totalCount);

            }

        });

        CidadesService.getAll().then((result) => {

            setIsLoadingCidades(false);

            if (result instanceof Error) {

                alert(result.message);

            } else {

                setTotalCountCidades(result.totalCount);

            }

        });

    }, []);

    return (
        <LayoutBaseDePagina
            titulo="Página inicial"
            barraDeFerramentas={(
                <FerramentasDeListagem mostrarBotaoNovo={false} />
            )}
        >
            <Box width="100%" display="flex">
                <Grid container m={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>

                            <Card>
                                <CardContent>
                                    <Typography variant="h5" align="center">
                                        Total de pessoas
                                    </Typography>

                                    <Box display="flex" justifyContent="center" align-items="center" p={6}>
                                        {!isLoadingPessoas && (
                                            <Typography variant="h1">
                                                {totalCountPessoas}
                                            </Typography>
                                        )}

                                        {isLoadingPessoas && (
                                            <Typography variant="h6">
                                                Carregando...
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>

                            <Card>
                                <CardContent>

                                    <Typography variant="h5" align="center">
                                        Total de cidades
                                    </Typography>

                                    <Box display="flex" justifyContent="center" align-items="center" p={6}>
                                        {!isLoadingCidades && (
                                            <Typography variant="h1">
                                                {totalCountCidades}
                                            </Typography>
                                        )}

                                        {isLoadingCidades && (
                                            <Typography variant="h6">
                                                Carregando...
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>

                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBaseDePagina>
    );

};