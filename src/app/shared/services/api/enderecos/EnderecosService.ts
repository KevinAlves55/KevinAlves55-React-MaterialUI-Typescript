import { Api } from "../axios-config";

import { Environment } from "./../../../environments/index";

export interface IListagemEndereco {

    id: number;
    cep: string;
    cidade: string;
    estado: string;
    bairro: string;
    rua: string;
    numero: number;
    complemento: string;

}

export interface IDetalheEndereco {

    id: number;
    cep: string;
    cidade: string;
    estado: string;
    bairro: string;
    rua: string;
    numero: number;
    complemento: string;

}

type TEnderecoComTotalCount = {

    data: IListagemEndereco[];
    totalCount: number;

}

const getAll = async (page = 1, filter = ""): Promise<TEnderecoComTotalCount | Error> => {

    try {

        const urlRelativa = `/enderecos?_page=${page}&_limit=${Environment.LIMITES_DE_LINHAS}&estado_like=${filter}`;

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
        return new Error((error as { message: string }).message || "Erro ao listar os registros");

    }

};

const getById = async (id: number): Promise<IDetalheEndereco | Error> => {

    try {

        const { data } = await Api.get(`/enderecos/${id}`);

        if (data) return data;


        return new Error("Erro ao consultar o registro");

    } catch (error) {

        console.error(error);
        return new Error((error as { message: string }).message || "Erro ao consultar o registro");

    }

};

const create = async (dataToCreate: Omit<IDetalheEndereco, "id">): Promise<number | Error> => {

    try {

        const { data } = await Api.post<IDetalheEndereco>("/enderecos", dataToCreate);

        if (data) {
            return data.id;
        }

        return new Error("Erro ao cadastrar um endereço");

    } catch (error) {

        console.error(error);
        return new Error((error as { message: string }).message || "Erro ao cadastrar um endereço");

    }

};

const updateById = async (id: number, dataToCreate: IDetalheEndereco): Promise<void | Error> => {

    try {

        await Api.put(`enderecos/${id}`, dataToCreate);

    } catch (error) {

        console.error(error);
        return new Error((error as { message: string }).message || "Erro ao atualizar registro");

    }

};

const deleteById = async (id: number): Promise<void | Error> => {

    try {

        await Api.delete(`/enderecos/${id}`);

    } catch (error) {

        console.error(error);
        return new Error((error as { message: string }).message || "Erro ao deletar o registro");

    }

};

export const EnderecoService = {

    getAll,
    getById,
    create,
    updateById,
    deleteById

};