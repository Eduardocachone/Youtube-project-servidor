import { pool } from "../../../mysql";
import { v4 as uuidv4} from 'uuid';
import { hash, compare } from 'bcrypt'
import {sign, verify} from 'jsonwebtoken'
import { Request,Response } from "express";


class UserRepository {
    create(request:Request , response:Response){
        const {name, email, password } = request.body;
        pool.getConnection((err:any, connection:any) => ( 
            hash(password,10,(err,hash) => {
                if (err) {
                    return response.status(500).json(err);
                 }
                connection.query(
                    'INSERT INTO user (user_id, name, email, password) VALUES (?,?,?,?)',
                    [uuidv4(), name, email, hash], 
                    (error:any , result:any, fileds:any) => {
                        connection.release()
                       if (error) {
                          return response.status(400).json(error);
                       }
                       response.status(200).json({massage:'Usuario criado com suceso'});
                    }
                )
            })
        ))  
    }

 
    
    

    login(request:Request , response:Response){
        const {password,email } = request.body;
        pool.getConnection((err:any, connection:any) => ( 
       
         connection.query(
            'SELECT * FROM user WHERE email = ?',
            [email], 
            (error:any , results:any, fileds:any) => {
            connection.release()
            if (error) {
                return response.status(400).json({error: "ERRO NA SUA AUTENTICAÇÃO!"});
            }
            compare(password,results[0].password, (err,result) => {
                if (err) {
                    return response.status(400).json({error: "ERRO NA SUA AUTENTICAÇÃO!"});
                }

                if (result){
                    const token = sign({
                        id: results[0].user_id,
                        email: results[0].email
                    }, process.env.SECRET as string , {expiresIn: "1d"})

                    return response.status(200).json({token:token , massage:'Autemticação comcluida com suceso'});
                }

            })
         }
        )
    ))
    }

    

    getUser(request: Request, response: Response) {
        const token = request.headers && request.headers.authorization;
        if (!token) {
            return response.status(401).json({ message: 'Token não encontrado!' });
        }
        const decode:any = verify(token, process.env.SECRET as string);
        if (decode.email) {
            pool.getConnection((error, conn) => {
                conn.query(
                    'SELECT * FROM user WHERE email=?',
                    [decode.email],
                    (error, resultado, fields) => {
                        conn.release();

                        if (resultado.length === 0) {
                            return response.status(404).send({ message: 'Usuário não encontrado' });
                          }

                        if (error) {
                            return response.status(400).send({
                                error: error,
                                response: null
                            });
                        }

                        return response.status(200).send({
                            user: {
                                nome: resultado[0].name,
                                email: resultado[0].email,
                                id: resultado[0].user_id,
                            }
                        });
                    }
                );
            });
            
        }
    }


}


export { UserRepository };