import { Api } from "../axios-config";

import { Environment } from "./../../../environments/index";

export interface IListagemCidade {

    id: number;
    nome: string;

}

export interface IDetalheCidade {

    id: number;
    nome: string;

}

type TCidadesComTotalCount = {

    data: IListagemCidade[];
    totalCount: number;

}

const getAll = async (page = 1, filter = ""): Promise<TCidadesComTotalCount | Error> => {

    try {
        
        const urlRelativa = `/cidades?_page=${page}&_limit=${Environment.LIMITES_DE_LINHAS}&nome_like=${filter}`;

        const { data, headers } = await Api.get(urlRelativa);

        if (data) {
            
            return {
                data,
                totalCount: Number(headers["x-total-count"] || Environment.LIMITES_DE_LINHAS)
            };

        }

        return new Error("Erro ao listar as cidades");

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao listar as cidades");
        
    }

};

const getById = async (id: number): Promise<IDetalheCidade | Error> => {

    try {

        const { data } = await Api.get(`/cidades/${id}`);

        if (data)
        return data;


        return new Error("Erro ao consultar a cidade");

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao consultar a cidade");
        
    }

};

const create = async (dataToCreate: Omit<IDetalheCidade, "id">): Promise<number | Error> => {

    try {
        
        const { data } = await Api.post<IDetalheCidade>("/cidades", dataToCreate);
        
        if (data) {
            return data.id;
        }

        return new Error("Erro ao cadastrar uma cidade");

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao cadastrar uma cidade");

    }

};

const updateById = async (id: number, dataToCreate: IDetalheCidade): Promise<void | Error> => {

    try {
        
        await Api.put(`cidades/${id}`, dataToCreate);

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao atualizar registro");

    }

};

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        
        await Api.delete(`/cidades/${id}`);

    } catch (error) {
        
        console.error(error);
        return new Error((error as {message:string}).message || "Erro ao deletar a cidade");

    }

};

export const CidadesService = {

    getAll,
    getById,
    create,
    updateById,
    deleteById

};