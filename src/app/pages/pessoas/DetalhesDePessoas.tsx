import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { FormHandles } from "@unform/core";

import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VTextField, VForm, useVForm } from "../../shared/forms";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";

interface IFormData {

    email: string
    cidadeId: number
    nomeCompleto: string

}

export const DetalhesDePessoas: React.FC<IFormData> = () => {

    const { id = "nova" } = useParams<"id">();
    const navigate = useNavigate();

    const { formRef, save, IsSaveAndClose, IsSaveAndNew, saveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [nome, setNome] = useState("");

    useEffect(() => {

        if (id !== "nova") {

            setIsLoading(true);
            
            PessoasService.getById(Number(id)).then((result) => {

                setIsLoading(false);

                if (result instanceof Error) {
                    
                    alert(result.message);
                    navigate("/pessoas");

                } else {

                    setNome(result.nomeCompleto);
                    console.log(result);

                    formRef.current?.setData(result);

                }

            });

        } else {
            
            formRef.current?.setData({
                email: "",
                cidadeId: "",
                nomeCompleto: ""
            });

        }

    }, [id]);

    const handleSave = (dados: IFormData) => {

        setIsLoading(true);

        if (id === "nova") {
            
            PessoasService.create(dados).then((result) => {

                setIsLoading(false);

                if (result instanceof Error) {
                    
                    alert("Erro ao cadastrar pessoa");
    
                } else {

                    if (IsSaveAndClose()) {

                        navigate("/pessoas");
                    
                    } else {

                        navigate(`/pessoas/detalhe/${result}`);
                        
                    }
    
    
                }
    
            });

        } else {

            PessoasService.updateById(Number(id), { id: Number(id), ...dados}).then((result) => {

                setIsLoading(false);

                if (result instanceof Error) {
                    
                    alert(result.message);
    
                } else {

                    if (IsSaveAndClose()) {

                        navigate("/pessoas");
                    
                    }

                }
    
            });

        }
    };

    const handleDelete = (id: number) => {

        if (confirm("Realmente deseja apagar?")) {

            PessoasService.deleteById(id).then(result => {

                if (result instanceof Error) {
    
                    alert(result.message);
                    
                } else {

                    alert("Registro deletado com sucesso");
                    navigate("/pessoas");

                }
            
            });
        
        }     

    };

    return(

        <LayoutBaseDePagina
            titulo={id === "nova" ? "Nova pessoa" : nome}
            barraDeFerramentas={
                <FerramentasDeDetalhe 
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEVoltar
                    mostrarBotaoNovo={id !== "nova"}
                    mostrarBotaoApagar={id !== "nova"}

                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEVoltar={saveAndClose}
                    aoClicarEmApagar={() => handleDelete(Number(id))}
                    aoClicarEmNovo={() => navigate("/pessoas/detalhe/nova")}
                    aoClicarEmVoltar={() => navigate("/pessoas")}
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
                                    label="Nome Completo"
                                    fullWidth
                                    name="nomeCompleto"
                                    disabled={isLoading}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Cidade"
                                    fullWidth 
                                    name="cidadeId"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Email"
                                    fullWidth
                                    name="email"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

            </VForm>
            
        </LayoutBaseDePagina>

    );

};