import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { FerramentasDeListagem } from "../../shared/components";
import { UseDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";

export const ListagemDePessoas: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();  
    const { debounce } = UseDebounce(3000);

    const busca = useMemo(() => {

        return searchParams.get("busca") || "";
    
    }, [searchParams]);

    useEffect(() => {

        debounce(() => {

            PessoasService.getAll(1, busca)
            .then((result) => {
    
                if (result instanceof Error) {
    
                    alert(result.message);
                    
                } else {
    
                    console.log(result);
    
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

        </LayoutBaseDePagina>
    );

};