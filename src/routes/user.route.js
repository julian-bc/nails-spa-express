import { Router } from "express";
import { deleteById, getAllCustomers, update } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

/**
 * @swagger
 * /users/customers:
 *   get:
 *     summary: Obtener lista paginada de clientes
 *     description: Retorna una lista paginada de usuarios con rol `customer`. Solo accesible para administradores y empleados.
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página actual para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de clientes por página
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalCustomers:
 *                   type: integer
 *                   example: 42
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19fabc"
 *                       names:
 *                         type: string
 *                         example: "Laura Gómez"
 *                       email:
 *                         type: string
 *                         example: "laura@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+573102223334"
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos suficientes
 *       500:
 *         description: Error interno al obtener los clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching paginated customers"
 */
router.get("/customers", authMiddleware, allowRoles("admin", "employee"), getAllCustomers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     description: Actualiza la información de un usuario específico. Solo accesible para administradores.
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *                 example: "Laura Gómez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "laura@example.com"
 *               phone:
 *                 type: string
 *                 example: "+573102223334"
 *               salary:
 *                 type: number
 *                 example: 1800000
 *               role:
 *                 type: string
 *                 enum: [admin, employee, customer]
 *                 example: "employee"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated with id: 6720a5a9a8b7a8b45c19fabc succcessfully!"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found!"
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos suficientes
 *       500:
 *         description: Error interno al actualizar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error is happened to update user"
 */
router.put("/:id", authMiddleware, allowRoles("admin"), update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     description: Elimina permanentemente un usuario del sistema. Solo accesible para administradores.
 *     tags: [Usuarios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted with id: 6720a5a9a8b7a8b45c19fabc successfully!"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found!"
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos suficientes
 *       500:
 *         description: Error interno al eliminar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error is happened to save user"
 */
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteById);

export default router
