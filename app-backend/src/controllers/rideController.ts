import { Request, Response } from 'express';
import { calculateRoute } from '../services/googleMapsService';

//BD para armazenar as viagens
const ridesDatabase: any[] = [];
  
const drivers = [
    {
        id: 1,
        name: "Homer Simpson",
        description: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
        review: { rating: 2, comment: "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts." },
        ratePerKm: 2.5,
        minKm: 1,
      },
      {
        id: 2,
        name: "Dominic Toretto",
        description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        vehicle: "Dodge Charger R/T 1970 modificado",
        review: { rating: 4, comment: "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!" },
        ratePerKm: 5,
        minKm: 5,
      },
      {
        id: 3,
        name: "James Bond",
        description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        vehicle: "Aston Martin DB5 clássico",
        review: { rating: 5, comment: "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto." },
        ratePerKm: 10,
        minKm: 10,
      },
];

//1º Endpoint - POST /ride/estimate - Estima uma viagem

export const estimateRide = async (req: Request, res: Response) => {
    const {customer_id, origin, destination} = req.body;

    if(!customer_id || !origin || !destination){
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Origem, destino e ID do cliente são obrigatórios!",
        });
    }

    if(origin === destination){
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Origem e destino não podem ser iguais.", 
        });
    }

    try{

        //Consulta API Routes do Maps
        const routeData = await calculateRoute(origin, destination);
        const distance = routeData.distance;
        const duration = routeData.duration;

        //Filtra e calcula os valores dos motoristas
        const availableDrivers = drivers
        .filter((driver) => distance >= driver.minKm)
        .map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.vehicle,
            review: driver.review,
            value: distance * driver.ratePerKm,
        }))
        .sort((a, b) => a.value - b.value);

        return res.status(200).json({
            origin: routeData.origin,
            destination: routeData.destination, distance, duration,
            options: availableDrivers,
            routeResponse: routeData.rawResponse,
        });
    } catch(error: any){
        return res.status(500).json({
            error_code: "ROUTE_CALCULATION_FAILED",
            error_description: error.message,
        });
    }
};

//2º Endpoint - PATCH /ride/confirm - Confirma uma viagem

export const confirmRide = async (req: Request, res: Response) => {
    const {customer_id, origin, destination, distance, duration, driver, value} = req.body;

    if(!customer_id || !origin || !destination || !distance || !duration || !driver || !value){
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Todos os campos são obrigatórios!",
        });
    }

    if(origin === destination){
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Endereço de origem deve ser diferente de destino",
        });
    }

    const driverExists = driver.find((d)=> d.id === driver.id);
    if(!driverExists){
        return res.status(404).json({
            error_code: "DRIVER_NOT_FOUND",
            error_description: "O motorista informado não foi encontrado",
        });
    }

    if(distance < driverExists.minKm){
        return res.status(406).json({
            error_code: "INVALID_DISTANCE",
            error_description: `A distancia é muito curta para o motorista ${driver.name}`
        });
    }

    //Salvando no BD

    const newRide = {
        id: ridesDatabase.length + 1,
        customer_id,
        origin,
        destination,
        distance,
        driver,
        value,
        date: new Date(),
    };

    ridesDatabase.push(newRide);

    return res.status(200).json({success: true});
};

//3º Endpoint - GET /ride/{customer_id} - Retorna o histórico de viagens

export const getRides = async (req:Request, res: Response) => {
    try{
        const {customer_id} = req.params;
        const {driver_id} = req.query;
    
        if(!customer_id){
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O ID do usuário é obrigatório",
            });
        }
    
        let userRides = ridesDatabase.filter((ride)=> ride.customer_id === customer_id);
    
        if (driver_id){
            const driver = drivers.find((d)=> d.id === Number(driver_id));
            if (!driver){
                return res.status(400).json({
                    error_code: "INVALID_DRIVER",
                    error_description: "O ID do motorista é invalido",
                });
            }
    
            userRides = userRides.filter((ride)=> ride.driver.id === Number(driver_id));
        }
    
        if(userRides.length === 0){
            return res.status(404).json({
                error_code: "NO_RIDES_FOUND",
                error_description: "Nenhuma corrida encontrada",
            });
        }
        return res.status(200).json({
            customer_id,
            rides: userRides.sort((a, b)=> b.date.getTime() - a.date.getTime()),
        });
    }catch (error){
        console.error("Erro ao buscar corridas:", error);
        return res.status(500).json({
            error_code: "SERVER_ERROR",
            error_description: "Erro interno do servidor",
        });
    }
};