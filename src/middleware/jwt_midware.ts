import express from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.TOKEN_SECRET) throw new Error('TOKEN_SECRET missing!');
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) throw new Error('missing token.');
    const token = authorizationHeader.split(' ')[1];
    const payload = jwt.verify(token, TOKEN_SECRET);
    res.locals.user = payload;
    next();
  } catch (error) {
    res.status(401);
    res.json(`Authentication failed, ${error}`);
  }
};

export { verifyToken };
