import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { EnderecoService, IListagemEndereco } from "../../shared/services/api/enderecos/EnderecosService";
import { UseDebounce } from "../../shared/hooks";


export const ListagemDeEndereco: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [endereco, setEndereco] = useState<IListagemEndereco[]>([]);
    const { debounce } = UseDebounce();

    const busca = useMemo(() => {
        return searchParams.get("busca") || "";
    }, [searchParams]);

    useEffect(() => {
        debounce(() => {
            EnderecoService.getAll(1, busca).then(result => {
                if (result instanceof Error) {
                    console.log("Erro ao trazer os dados");
                } else {
                    setEndereco(result.data);
                }
            });
        });
    }, [busca]);

    return (

        <LayoutBaseDePagina
            titulo="Listagem de endereço"
            barraDeFerramentas={
                <FerramentasDeListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo="Nova"
                    aoMudarTextoDeBusca={texto => setSearchParams(
                        { busca: texto },
                        { replace: true }
                    )}
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
                                        >
                                            <Icon>delete</Icon>
                                        </IconButton>
                                        <IconButton
                                            size="small"
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
                </Table>
            </TableContainer>
        </LayoutBaseDePagina>

    );

};