"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => ((0, bcrypt_1.hash)(password, 10, (err, hash) => {
            if (err) {
                return response.status(500).json(err);
            }
            connection.query('INSERT INTO user (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hash], (error, result, fileds) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error);
                }
                response.status(200).json({ massage: 'Usuario criado com suceso' });
            });
        })));
    }
    login(request, response) {
        const { password, email } = request.body;
        mysql_1.pool.getConnection((err, connection) => (connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results, fileds) => {
            connection.release();
            if (error) {
                return response.status(400).json({ error: "ERRO NA SUA AUTENTICAÇÃO!" });
            }
            (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                if (err) {
                    return response.status(400).json({ error: "ERRO NA SUA AUTENTICAÇÃO!" });
                }
                if (result) {
                    const token = (0, jsonwebtoken_1.sign)({
                        id: results[0].user_id,
                        email: results[0].email
                    }, process.env.SECRET, { expiresIn: "1d" });
                    return response.status(200).json({ token: token, massage: 'Autemticação comcluida com suceso' });
                }
            });
        })));
    }
    getUser(request, response) {
        const token = request.headers && request.headers.authorization;
        if (!token) {
            return response.status(401).json({ message: 'Token não encontrado!' });
        }
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, conn) => {
                conn.query('SELECT * FROM user WHERE email=?', [decode.email], (error, resultado, fields) => {
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
                });
            });
        }
    }
}
exports.UserRepository = UserRepository;
