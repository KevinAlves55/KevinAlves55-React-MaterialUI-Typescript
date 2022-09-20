import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";

import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { EnderecoService, IListagemEndereco } from "../../shared/services/api/enderecos/EnderecosService";
import { UseDebounce } from "../../shared/hooks";
import { Environment } from "../../shared/environments";


export const ListagemDeEndereco: React.FC = () => {

    const [endereco, setEndereco] = useState<IListagemEndereco[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { debounce } = UseDebounce();

    const busca = useMemo(() => {
        return searchParams.get("busca") || "";
    }, [searchParams]);

    const pagina = useMemo(() => {
        return searchParams.get("pagina") || "1";
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            EnderecoService.getAll(Number(pagina), busca).then(result => {
                setIsLoading(false);

                if (result instanceof Error) {
                    console.log("Erro ao trazer os dados");
                } else {
                    setEndereco(result.data);
                    setTotalCount(result.totalCount);
                }
            });
        });
    }, [busca, pagina]);

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir esse registro?")) {
            EnderecoService.deleteById(id).then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    setEndereco(oldEnderecos => [
                        ...oldEnderecos.filter(oldEndereco => oldEndereco.id !== id)
                    ]);
                }
            });
        }
    };

    return (

        <LayoutBaseDePagina
            titulo="Listagem de endereço"
            barraDeFerramentas={
                <FerramentasDeListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo="Nova"
                    aoMudarTextoDeBusca={texto => setSearchParams(
                        { busca: texto, pagina: "1" },
                        { replace: true }
                    )}
                    aoClicarEmNovo={() => navigate("/enderecos/detalhe/nova")}
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
                            <TableCell>CEP</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Cidade</TableCell>
                            <TableCell>Bairro</TableCell>
                            <TableCell>Rua</TableCell>
                            <TableCell>Número</TableCell>
                            <TableCell>Complemento</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            endereco.map(({ id, cep, estado, cidade, bairro, rua, numero, complemento }) => (
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
                                            onClick={() => navigate(`/enderecos/detalhe/${id}`)}
                                        >
                                            <Icon>edit</Icon>
                                        </IconButton>
                                    </TableCell>

                                    <TableCell>{cep}</TableCell>
                                    <TableCell>{estado}</TableCell>
                                    <TableCell>{cidade}</TableCell>
                                    <TableCell>{bairro}</TableCell>
                                    <TableCell>{rua}</TableCell>
                                    <TableCell>{numero}</TableCell>
                                    <TableCell>{complemento}</TableCell>
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
                                <TableCell colSpan={9}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}

                        {(totalCount > Environment.LIMITES_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={9}>
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