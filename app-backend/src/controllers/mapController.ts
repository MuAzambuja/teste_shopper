import { getCoordinates } from "../services/googleMapsService";
import express, { Request, Response } from 'express';

interface CoordinatesRequest extends Request {
    query: {
        address: string;
    };
}

export async function fetchCoordinates(req: CoordinatesRequest, res: Response): Promise<void>{
    const address = req.query.address;

    if(!address){
        res.status(400).send('O endereço é obrigatório!');
    }

    try{
        const coordinates = await getCoordinates(address);
        res.status(200).json(coordinates);
    }catch(error){
        res.status(500).send('Erro ao buscar coordenadas');
    }
}