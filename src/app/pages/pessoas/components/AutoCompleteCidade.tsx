import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { useEffect, useMemo, useState } from "react";
import { UseDebounce } from "../../../shared/hooks";
import { CidadesService } from "../../../shared/services/api/cidades/CidadesService";

type TAutoCompleteOptions = {

    id: number;
    label: string;

}

interface IAutoCompleteCidadeProps {

    isExternalLoading?: boolean;

}

export const AutoCompleteCidade: React.FC<IAutoCompleteCidadeProps> = ({ isExternalLoading = false }) => {

    const { clearError, defaultValue, error, fieldName, registerField } = useField("cidadeId");

    const { debounce } = UseDebounce();

    const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue);

    const [options, setOptions] = useState<TAutoCompleteOptions[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState("");
    
    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId) 
        });
    }, [registerField, fieldName, selectedId]);

    useEffect(() => {

        setIsLoading(true);

        debounce(() => {

            CidadesService.getAll(1, busca).then((result) => {

                setIsLoading(false);
    
                if (result instanceof Error) {

                    alert(result.message);
                    
                } else {

                    console.log(result);                    
    
                    setOptions(result.data.map(cidade => (
                        { id: cidade.id, label: cidade.nome }
                    )));
    
                }
            
            });

        });
        

    }, [busca]);

    const autoCompleteSelectedOption = useMemo(() => {
        
        if (!selectedId) return null;

        const selectedOption = options.find(option => option.id === selectedId);
        if (!selectedId) return null;

        return selectedOption;

    }, [selectedId, options]);

    return(

        <Autocomplete
            disablePortal
            openText="Abrir"
            closeText="Fechar"
            noOptionsText="Sem opções"
            loadingText="Carregando..."
            value={autoCompleteSelectedOption}  
            disabled={isExternalLoading}
            loading={isLoading}
            popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
            onInputChange={(_, newValue) => setBusca(newValue)}
            options={options}
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(""); clearError(); }}
            renderInput={(params) => 
                <TextField 
                    {...params}

                    label="Cidade"
                    error={!!error}
                    helperText={error}
                />
            }
        />
    
    );

};