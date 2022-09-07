import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import * as yup from "yup";

import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { CidadesService } from "../../shared/services/api/cidades/CidadesService";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";

interface IFormData {

    nome: string;

}

const formValidatorSchema: yup.SchemaOf<IFormData> = yup.object().shape({

    nome: yup.string().required().min(3).trim(),

});

export const DetalhesDeCidades: React.FC<IFormData> = () => {

    const { id = "nova" } = useParams<"id">();
    const navigate = useNavigate();

    const { formRef, save, IsSaveAndClose, saveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState("");

    useEffect(() => {

        if (id !== "nova") {

            setIsLoading(true);
            
            CidadesService.getById(Number(id)).then((result) => {

                setIsLoading(false);

                if (result instanceof Error) {
                    
                    alert(result.message);
                    navigate("/cidades");

                } else {

                    setNome(result.nome);
                    console.log(result);

                    formRef.current?.setData(result);

                }

            });

        } else {
            
            formRef.current?.setData({
                nome: ""
            });

        }

    }, [id]);

    const handleSave = (dados: IFormData) => {

        formValidatorSchema.validate(
            dados, 
            { abortEarly: false }
        ).then((dadosValidados) => {

            setIsLoading(true);

            if (id === "nova") {
                
                CidadesService.create(dadosValidados).then((result) => {

                    setIsLoading(false);

                    if (result instanceof Error) {
                        
                        alert("Erro ao cadastrar cidade");
        
                    } else {

                        if (IsSaveAndClose()) {

                            navigate("/cidades");
                        
                        } else {

                            navigate(`/cidades/detalhe/${result}`);
                            
                        }
        
        
                    }
        
                });

            } else {

                CidadesService.updateById(Number(id), { id: Number(id), ...dadosValidados}).then((result) => {

                    setIsLoading(false);

                    if (result instanceof Error) {
                        
                        alert(result.message);
        
                    } else {

                        if (IsSaveAndClose()) {

                            navigate("/cidades");
                        
                        }

                    }
        
                });

            }

        }).catch((errors: yup.ValidationError) => {

            const validationErros: IVFormErrors = {};

            errors.inner.forEach(error => {

                if (!error.path) return;

                validationErros[error.path] = error.message;

            });

            formRef.current?.setErrors(validationErros);

        });
    
    };

    const handleDelete = (id: number) => {

        if (confirm("Realmente deseja apagar?")) {

            CidadesService.deleteById(id).then(result => {

                if (result instanceof Error) {
    
                    alert(result.message);
                    
                } else {

                    alert("Cidade deletado com sucesso");
                    navigate("/cidades");

                }
            
            });
        
        }     

    };

    return(

        <LayoutBaseDePagina
            titulo={id === "nova" ? "Nova cidade" : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe 
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEVoltar
                    mostrarBotaoNovo={id !== "nova"}
                    mostrarBotaoApagar={id !== "nova"}

                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEVoltar={saveAndClose}
                    aoClicarEmApagar={() => handleDelete(Number(id))}
                    aoClicarEmNovo={() => navigate("/cidades/detalhe/nova")}
                    aoClicarEmVoltar={() => navigate("/cidades")}
                />
            }
        >

            <VForm ref={formRef} onSubmit={(dados) => handleSave(dados)}>

                <Box m={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

                    <Grid container direction="column" padding={2} spacing={2}>

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate" />
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant="h6">Geral</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Nome"
                                    fullWidth
                                    name="nome"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

            </VForm>
            
        </LayoutBaseDePagina>

    );

};