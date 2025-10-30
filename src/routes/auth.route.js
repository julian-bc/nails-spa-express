import { Router } from "express";
import { check, login, logout, register } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema con su información básica y contraseña encriptada.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - names
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               names:
 *                 type: string
 *                 example: "Laura Gómez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "laura@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "miContraseñaSegura123"
 *               phone:
 *                 type: string
 *                 example: "+573123456789"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "register successfully!"
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno al guardar el usuario
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Verifica las credenciales del usuario, genera un token de acceso y lo guarda en una cookie segura.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "laura@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "miContraseñaSegura123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Devuelve un mensaje y establece cookies de sesión.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Cookies de autenticación (token y rol)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "login successfully!"
 *       401:
 *         description: Contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Incorrect password!"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User not founded with email: laura@example.com"
 *       500:
 *         description: Error interno durante el inicio de sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error is happened to login!"
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Cerrar sesión de usuario
 *     description: Elimina las cookies de autenticación (`token` y `role`) para cerrar la sesión del usuario.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "logout successfully!"
 *       500:
 *         description: Error interno al cerrar sesión
 */
router.get("/logout", logout);

/**
 * @swagger
 * /auth/check:
 *   get:
 *     summary: Verificar autenticación del usuario
 *     description: Verifica si el usuario posee un token válido en las cookies. Retorna el estado de autenticación y los datos del usuario si es válido.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token válido, el usuario está autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: Datos decodificados del token
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6720a5a9a8b7a8b45c19f123"
 *                     email:
 *                       type: string
 *                       example: "laura@example.com"
 *                     names:
 *                       type: string
 *                       example: "Laura Gómez"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       401:
 *         description: Token ausente, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Token inválido o expirado"
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - cookieAuth: []
 */
router.get("/check", check);

export default router
