import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";


export const ListagemDeEndereco: React.FC = () => {

    return (

        <LayoutBaseDePagina
            titulo="Listagem de endereço"
            barraDeFerramentas={
                <FerramentasDeListagem
                    mostrarInputBusca
                    textoBotaoNovo="Nova"
                />
            }
        >

        </LayoutBaseDePagina>

    );

};