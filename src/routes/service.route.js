import { Router } from "express";
import { getAllServices, addStaffToService, getServiceById } from "../controllers/service.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Obtener lista paginada de servicios
 *     description: Retorna una lista paginada de todos los servicios registrados, incluyendo los empleados que pueden realizarlos.
 *     tags: [Servicios]
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
 *         description: Cantidad de servicios por página
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida exitosamente
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
 *                   example: 4
 *                 totalServices:
 *                   type: integer
 *                   example: 35
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f777"
 *                       name:
 *                         type: string
 *                         example: "Manicure Spa"
 *                       price:
 *                         type: number
 *                         example: 35000
 *                       duration:
 *                         type: integer
 *                         example: 60
 *                       staffCapable:
 *                         type: array
 *                         description: Empleados capacitados para realizar este servicio
 *                         items:
 *                           type: object
 *                           properties:
 *                             names:
 *                               type: string
 *                               example: "María López"
 *                             email:
 *                               type: string
 *                               example: "maria@example.com"
 *                             locations:
 *                               type: array
 *                               items:
 *                                 type: string
 *                                 example: "Sede Centro"
 *       500:
 *         description: Error interno al obtener los servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching paginated services"
 */
router.get("/", getAllServices);

/**
 * @swagger
 * /services/{id}/staff:
 *   post:
 *     summary: Agregar personal capacitado a un servicio
 *     description: Agrega uno o varios empleados a la lista de personal capacitado para un servicio específico. Solo accesible para usuarios con rol `admin`.
 *     tags: [Servicios]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffCapable
 *             properties:
 *               staffCapable:
 *                 type: array
 *                 description: Lista de IDs de empleados que pueden realizar el servicio
 *                 items:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19e111"
 *                 example: ["6720a5a9a8b7a8b45c19e111", "6720a5a9a8b7a8b45c19e222"]
 *     responses:
 *       200:
 *         description: Personal agregado exitosamente al servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f777"
 *                 name:
 *                   type: string
 *                   example: "Manicure Spa"
 *                 staffCapable:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "6720a5a9a8b7a8b45c19e111"
 *       404:
 *         description: Servicio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Service not found"
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos (solo administradores pueden acceder)
 *       500:
 *         description: Error interno al agregar personal al servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error adding staff to service"
 */
router.post("/:id/staff", authMiddleware, allowRoles("admin"), addStaffToService);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     description: Retorna la información detallada de un servicio, incluyendo los empleados capacitados para realizarlo.
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f777"
 *                 name:
 *                   type: string
 *                   example: "Pedicure Deluxe"
 *                 price:
 *                   type: number
 *                   example: 40000
 *                 duration:
 *                   type: integer
 *                   example: 75
 *                 staffCapable:
 *                   type: array
 *                   description: Lista de empleados capacitados para este servicio
 *                   items:
 *                     type: object
 *                     properties:
 *                       names:
 *                         type: string
 *                         example: "Laura Gómez"
 *                       email:
 *                         type: string
 *                         example: "laura@example.com"
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "Sede Norte"
 *       404:
 *         description: Servicio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Service not found"
 *       500:
 *         description: Error interno al obtener el servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching service by ID"
 */
router.get("/:id", getServiceById);

export default router