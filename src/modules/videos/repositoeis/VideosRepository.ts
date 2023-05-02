import { pool } from "../../../mysql";
import { v4 as uuidv4} from 'uuid';


import { Request,Response } from "express";


class VideoRepository {
    create(request:Request , response:Response){
        const {title, description, user_id } = request.body;
        pool.getConnection((err:any, connection:any) => ( 

            connection.query(
                'INSERT INTO videos (video_id, user_id, title, description) VALUES (?,?,?,?)',
                [uuidv4(),user_id, title , description ], 
                (error:any , result:any, fileds:any) => {
                    connection.release()
                    if (error) {
                        return response.status(400).json(error);
                    }
                    response.status(200).json({massage: 'Video criado com suseso'});
                }
            )
        ))  
    }
    getVideos(request: Request, response: Response) {
        const { user_id } = request.body;
        pool.getConnection((err: any, connection: any) => {
          if (err) {
            console.error('Erro ao obter conexão do pool: ', err);
            return response.status(500).json({ error: 'Erro interno do servidor' });
          }
          
          connection.query(
            'SELECT * FROM videos WHERE user_id = ?',
            [user_id],
            (error: any, results: any, fields: any) => {
              connection.release();
              if (error) {
                console.error('Erro ao executar consulta: ', error);
                return response.status(400).json({ error: 'Erro na sua autenticação!' });
              }
              return response.status(200).json({ massage:'Videos retornados com suceso',videos:results});
            }
          );
        });
      }

      serachVideos(request: Request, response: Response) {
        const { search } = request.query;
        pool.getConnection((err: any, connection: any) => {
          
          connection.query(
            'SELECT * FROM videos WHERE title LIKE ?',
            [`%${search}%`],
            (error: any, results: any, fields: any) => {
              connection.release();
              if (error) {
                console.error('Erro ao executar consulta: ', error);
                return response.status(400).json({ error: 'Erro na sua autenticação!' });
              }
              return response.status(200).json({ massage:'Videos retornados com suceso',videos:results});
            }
          );
        });
      }
}


export { VideoRepository };