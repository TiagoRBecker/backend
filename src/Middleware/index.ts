import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role:string;
      };
    }
  }
}

export const chekingToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.SECRET;

  let token;

  // Verifica se há um token no cabeçalho Authorization
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const [authtype, authToken] = authorizationHeader.split(" ");
    if (authtype === 'Bearer') {
      token = authToken;
   
    }
  }

  // Se não houver token no cabeçalho, verifica se há um token na query
  if (!token) {
    const queryToken = req.query.token as string;
    if (queryToken) {
      token = queryToken;
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "Não autorizado" });
  }

  try {
    const decoded = await Jwt.verify(token, secret as string);
    req.user = decoded as any; // Adiciona as informações do usuário ao objeto de requisição
    res.cookie('token', token, { path: '/' });
    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err);
    res.status(401).json({ msg: 'Não autorizado' });
  }
};
