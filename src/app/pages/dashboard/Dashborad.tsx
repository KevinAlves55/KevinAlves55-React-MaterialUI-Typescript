import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const Dashborad: React.FC = () => {

    return(
        <LayoutBaseDePagina 
            titulo="Página inicial" 
            barraDeFerramentas={(
                <FerramentasDeDetalhe mostrarBotaoSalvarEVoltar mostrarBotaoSalvarEVoltarCarregando/>
            )}
        >
            Testando
        </LayoutBaseDePagina>
    );

};