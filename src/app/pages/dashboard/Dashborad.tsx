import { FerramentasDeListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const Dashborad: React.FC = () => {

    return(
        <LayoutBaseDePagina 
            titulo="Página inicial" 
            barraDeFerramentas={(
                <FerramentasDeListagem 
                    mostrarInputBusca
                    textoBotaoNovo="Nova"
                />
            )}
        >
            Testando
        </LayoutBaseDePagina>
    );

};