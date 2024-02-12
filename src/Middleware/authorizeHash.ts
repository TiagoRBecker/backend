import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";


export const setTempHashCookie = (req:Request, res:Response, next:NextFunction) => {
    const hash = randomUUID()
  
    // Configurar o cookie no navegador do usuário
    res.cookie('tempHash', hash, { maxAge: 2 * 60 * 60 * 1000 }); // Tempo de vida de 2 horas em milissegundos
  
    // Continue para a próxima rota
    next();
  };