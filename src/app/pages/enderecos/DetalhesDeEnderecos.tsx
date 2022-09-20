import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import * as yup from "yup";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { EnderecoService } from "../../shared/services/api/enderecos/EnderecosService";
import { Grid, LinearProgress, Paper, Typography } from "@mui/material";
import axios from "axios";

interface IFormData {
    cep: string;
    cidade: string;
    estado: string;
    bairro: string;
    rua: string;
    numero: number;
    complemento: string;
}

const formValidatorSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    cep: yup.string()
        .required()
        .trim(),

    cidade: yup.string()
        .required()
        .trim(),

    estado: yup.string()
        .required()
        .trim(),

    bairro: yup.string()
        .required()
        .trim(),

    rua: yup.string()
        .required()
        .trim(),

    numero: yup.number()
        .required(),

    complemento: yup.string()
        .required()
        .trim(),
});

export const DetalhesDeEnderecos: React.FC<IFormData> = () => {

    const { id = "nova" } = useParams<"id">();
    const navigate = useNavigate();

    const { formRef, save, IsSaveAndClose, saveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [cep, setCep] = useState("");

    useEffect(() => {
        if (id !== "nova") {
            setIsLoading(true);

            EnderecoService.getById(Number(id)).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                    navigate("/enderecos");
                } else {
                    setCep(result.cep);
                    console.log(result);
                    formRef.current?.setData(result);
                }
            });
        } else {
            formRef.current?.setData({
                cep: "",
                cidade: "",
                estado: "",
                bairro: "",
                rua: "",
                numero: "",
                complemento: ""
            });
        }
    }, [id]);

    const handleCep = async (cep: string) => {
        axios(`https://viacep.com.br/ws/${cep}/json/`).then(result => {
            const dados = result.data;
            formRef.current?.setData({
                cep: dados.cep,
                cidade: dados.localidade,
                estado: dados.uf,
                bairro: dados.bairro,
                rua: dados.logradouro,
                numero: "",
                complemento: ""
            });
            console.log(result);

        }).catch(error => {
            alert(error.message);
        });
    };

    const handleSave = (dados: IFormData) => {
        formValidatorSchema.validate(
            dados,
            { abortEarly: false }
        ).then((dadosValidados) => {
            setIsLoading(true);

            if (id === "nova") {
                EnderecoService.create(dadosValidados).then((result) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        alert("Erro ao cadastrar endereço");
                    } else {
                        if (IsSaveAndClose()) {
                            navigate("/enderecos");
                        } else {
                            navigate(`/enderecos/detalhe/${result}`);
                        }
                    }
                });
            } else {
                EnderecoService.updateById(Number(id), { id: Number(id), ...dadosValidados }).then((result) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        if (IsSaveAndClose()) {
                            navigate("/enderecos");
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
            EnderecoService.deleteById(id).then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert("Cidade deletado com sucesso");
                    navigate("/enderecos");
                }
            });
        }
    };

    return (
        <LayoutBaseDePagina
            titulo={id === "nova" ? "Nova cidade" : cep}
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    textoBotaoNovo="Nova"
                    mostrarBotaoSalvarEVoltar
                    mostrarBotaoNovo={id !== "nova"}
                    mostrarBotaoApagar={id !== "nova"}

                    aoClicarEmSalvar={save}
                    aoClicarEmSalvarEVoltar={saveAndClose}
                    aoClicarEmApagar={() => handleDelete(Number(id))}
                    aoClicarEmNovo={() => navigate("/enderecos/detalhe/nova")}
                    aoClicarEmVoltar={() => navigate("/enderecos")}
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
                                    label="CEP"
                                    fullWidth
                                    name="cep"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                    onChange={e => setCep(e.target.value)}
                                    onBlur={e => handleCep(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Cidade"
                                    fullWidth
                                    name="cidade"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Estado"
                                    fullWidth
                                    name="estado"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Bairro"
                                    fullWidth
                                    name="bairro"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Rua"
                                    fullWidth
                                    name="rua"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} xl={2}>
                                <VTextField
                                    label="Numero"
                                    fullWidth
                                    name="numero"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                />
                            </Grid>
                        </Grid>
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={12} xl={2}>
                                <VTextField
                                    label="Complemento"
                                    fullWidth
                                    name="complemento"
                                    disabled={isLoading}
                                    placeholder="Ex: São Paulo"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </VForm>
        </LayoutBaseDePagina>

    );

};