import { useEffect, useMemo, useState } from "react";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { PessoasService, IListagemPessoa } from "../../shared/services/api/pessoas/PessoasService";
import { Environment } from "../../shared/environments";
import { UseDebounce } from "../../shared/hooks";

export const ListagemDePessoas: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = UseDebounce();
    const navigate = useNavigate();

    const [pessoas, setPessoas] = useState<IListagemPessoa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const busca = useMemo(() => {

        return searchParams.get("busca") || "";

    }, [searchParams]);

    const pagina = useMemo(() => {

        return searchParams.get("pagina") || "1";

    }, [searchParams]);

    useEffect(() => {

        setIsLoading(true);

        debounce(() => {

            PessoasService.getAll(Number(pagina), busca).then((result) => {

                setIsLoading(false);

                if (result instanceof Error) {

                    alert(result.message);

                } else {

                    console.log(result);

                    setPessoas(result.data);
                    setTotalCount(result.totalCount);

                }

            });

        });


    }, [busca, pagina]);

    const handleDelete = (id: number) => {

        if (confirm("Realmente deseja apagar?")) {

            PessoasService.deleteById(id).then(result => {

                if (result instanceof Error) {

                    alert(result.message);

                } else {

                    setPessoas(oldRows => [

                        ...oldRows.filter(oldRow => oldRow.id !== id)

                    ]);

                }

            });

        }

    };

    return (
        <LayoutBaseDePagina
            titulo="Listagem de pessoas"
            barraDeFerramentas={
                <FerramentasDeListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo="Nova"
                    aoMudarTextoDeBusca={texto => setSearchParams(
                        { busca: texto, pagina: "1" },
                        { replace: true }
                    )}
                    aoClicarEmNovo={() => navigate("/pessoas/detalhe/nova")}
                />
            }
        >

            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                    m: 1,
                    width: "auto"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="100">Ações</TableCell>
                            <TableCell>Nome Completo</TableCell>
                            <TableCell>CNPJ</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Celular</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {
                            pessoas.map(({ id, nomeCompleto, email, cnpj, celular }) => (
                                <TableRow key={id}>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(id)}
                                        >
                                            <Icon>delete</Icon>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate(`/pessoas/detalhe/${id}`)}
                                        >
                                            <Icon>edit</Icon>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{nomeCompleto}</TableCell>
                                    <TableCell>{cnpj}</TableCell>
                                    <TableCell>{email}</TableCell>
                                    <TableCell>{celular}</TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>

                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                    )}

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}

                        {(totalCount > Environment.LIMITES_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                        page={Number(pagina)}
                                        count={Math.ceil(totalCount / Environment.LIMITES_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams(
                                            { busca, pagina: newPage.toString() },
                                            { replace: true }
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>

        </LayoutBaseDePagina>
    );

};