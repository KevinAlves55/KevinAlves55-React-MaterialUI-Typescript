import { useEffect, useMemo, useState } from "react";
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { FerramentasDeListagem } from "../../shared/components";
import { UseDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { PessoasService, IListagemPessoa } from "../../shared/services/api/pessoas/PessoasService";
import { Environment } from "../../shared/environments";

export const ListagemDePessoas: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();  
    const { debounce } = UseDebounce();

    const [rows, setRows] = useState<IListagemPessoa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const busca = useMemo(() => {

        return searchParams.get("busca") || "";
    
    }, [searchParams]);

    const pagina = useMemo(() => {

        return searchParams.get("pagina") || "";
    
    }, [searchParams]);

    useEffect(() => {

        setIsLoading(true);

        debounce(() => {

            PessoasService.getAll(1, busca).then((result) => {

                setIsLoading(false);
    
                if (result instanceof Error) {
    
                    alert(result.message);
                    
                } else {

                    console.log(result);                    
    
                    setRows(result.data);
                    setTotalCount(result.totalCount);
    
                }
            
            });

        });
        

    }, [busca]);

    return(
        <LayoutBaseDePagina 
            titulo="Listagem de pessoas"
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
                            <TableCell>Ações</TableCell>
                            <TableCell>Nome Completo</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        
                        {
                            rows.map(({ id, nomeCompleto, email }) => (
                                <TableRow key={id}>
                                    <TableCell>Ações</TableCell>
                                    <TableCell>{nomeCompleto}</TableCell>
                                    <TableCell>{email}</TableCell>
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
                                    <LinearProgress variant="indeterminate"/>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>

        </LayoutBaseDePagina>
    );

};