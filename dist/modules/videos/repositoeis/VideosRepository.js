"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    create(request, response) {
        const { title, description, user_id } = request.body;
        mysql_1.pool.getConnection((err, connection) => (connection.query('INSERT INTO videos (video_id, user_id, title, description) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), user_id, title, description], (error, result, fileds) => {
            connection.release();
            if (error) {
                return response.status(400).json(error);
            }
            response.status(200).json({ massage: 'Video criado com suseso' });
        })));
    }
    getVideos(request, response) {
        const { user_id } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            if (err) {
                console.error('Erro ao obter conexão do pool: ', err);
                return response.status(500).json({ error: 'Erro interno do servidor' });
            }
            connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results, fields) => {
                connection.release();
                if (error) {
                    console.error('Erro ao executar consulta: ', error);
                    return response.status(400).json({ error: 'Erro na sua autenticação!' });
                }
                return response.status(200).json({ massage: 'Videos retornados com suceso', videos: results });
            });
        });
    }
    serachVideos(request, response) {
        const { search } = request.query;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE title LIKE ?', [`%${search}%`], (error, results, fields) => {
                connection.release();
                if (error) {
                    console.error('Erro ao executar consulta: ', error);
                    return response.status(400).json({ error: 'Erro na sua autenticação!' });
                }
                return response.status(200).json({ massage: 'Videos retornados com suceso', videos: results });
            });
        });
    }
}
exports.VideoRepository = VideoRepository;
