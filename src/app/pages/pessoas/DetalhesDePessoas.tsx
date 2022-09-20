import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import * as yup from "yup";

import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { AutoCompleteCidade } from "./components/AutoCompleteCidade";
import { VPatternFormat } from "../../shared/forms/VPatternFormat";

interface IFormData {

    email: string;
    cidadeId: number;
    nomeCompleto: string;
    cnpj: string;
    celular: string;

}

const formValidatorSchema: yup.SchemaOf<IFormData> = yup.object().shape({

    nomeCompleto: yup.string()
        .required()
        .min(3)
        .uppercase()
        .matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, "O campo só permite letras e acentos")
        .trim(),

    email: yup.string()
        .required()
        .email()
        .trim(),

    cidadeId: yup.number()
        .required(),

    cnpj: yup.string()
        .required()
        .min(11),

    celular: yup.string()
        .required()

});

export const DetalhesDePessoas: React.FC<IFormData> = () => {

    const { id = "nova" } = useParams<"id">();
    const navigate = useNavigate();

    const { formRef, save, IsSaveAndClose, saveAndClose } = useVForm();

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
                nomeCompleto: "",
                cnpj: "",
                celular: ""
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

                PessoasService.create(dadosValidados).then((result) => {

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

                PessoasService.updateById(Number(id), { id: Number(id), ...dadosValidados }).then((result) => {

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

    return (

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
                                <VPatternFormat
                                    label="CNPJ"
                                    fullWidth
                                    name="cnpj"
                                    disabled={isLoading}
                                    format="###.###.###-##"
                                    valueIsNumericString
                                    mask="_"
                                />
                            </Grid>
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
                                <AutoCompleteCidade isExternalLoading={isLoading} />
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

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VPatternFormat
                                    label="Celular"
                                    fullWidth
                                    name="celular"
                                    disabled={isLoading}
                                    format="(##) #####-####"
                                    valueIsNumericString
                                    mask="_"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

            </VForm>

        </LayoutBaseDePagina>

    );

};