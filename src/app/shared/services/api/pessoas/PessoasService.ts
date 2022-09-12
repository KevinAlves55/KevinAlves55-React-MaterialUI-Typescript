import { Api } from "../axios-config";

import { Environment } from "./../../../environments/index";

export interface IListagemPessoa {

    id: number;
    email: string;
    cidadeId: number;
    nomeCompleto: string;
    cnpj: string;
    celular: string;

}

export interface IDetalhePessoa {

    id: number;
    email: string;
    cidadeId: number;
    nomeCompleto: string;
    cnpj: string;
    celular: string;

}

type TPessoasComTotalCount = {

    data: IListagemPessoa[];
    totalCount: number;

}

const getAll = async (page = 1, filter = ""): Promise<TPessoasComTotalCount | Error> => {

    try {
        
        const urlRelativa = `/pessoas?_page=${page}&_limit=${Environment.LIMITES_DE_LINHAS}&nomeCompleto_like=${filter}`;

        const { data, headers } = await Api.get(urlRelativa);

        if (data) {
            
            return {
                data,
                totalCount: Number(headers["x-total-count"] || Environment.LIMITES_DE_LINHAS)
            };

        }

        return new Error("Erro ao listar os registros");

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao listar os registros");
        
    }

};

const getById = async (id: number): Promise<IDetalhePessoa | Error> => {

    try {

        const { data } = await Api.get(`/pessoas/${id}`);

        if (data)
        return data;


        return new Error("Erro ao consultar o registro");

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao consultar o registro");
        
    }

};

const create = async (dataToCreate: Omit<IDetalhePessoa, "id">): Promise<number | Error> => {

    try {
        
        const { data } = await Api.post<IDetalhePessoa>("/pessoas", dataToCreate);
        
        if (data) {
            return data.id;
        }

        return new Error("Erro ao cadastrar uma pessoa");

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao cadastrar uma pessoa");

    }

};

const updateById = async (id: number, dataToCreate: IDetalhePessoa): Promise<void | Error> => {

    try {
        
        await Api.put(`pessoas/${id}`, dataToCreate);

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao atualizar registro");

    }

};

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        
        await Api.delete(`/pessoas/${id}`);

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao deletar o registro");

    }

};

export const PessoasService = {

    getAll,
    getById,
    create,
    updateById,
    deleteById

};