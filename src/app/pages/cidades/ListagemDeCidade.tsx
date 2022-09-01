import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const ListagemDeCidade: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    

    const busca = useMemo(() => {

        return searchParams.get("Busca") || "";


    }, [searchParams]);

    return(
        <LayoutBaseDePagina 
            titulo="Listagem de cidades"
            barraDeFerramentas={
                <FerramentasDeListagem 
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo="Nova"
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
                />
            }
        >

        </LayoutBaseDePagina>
    );

};