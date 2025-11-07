import { Router } from "express";
import { getAllBySede, getAllEmployees, saveEmployee } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Obtener lista paginada de empleados
 *     description: Retorna una lista paginada de empleados con su información básica. Solo accesible para usuarios con rol `admin`.
 *     tags: [Empleados]
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
 *         description: Cantidad de empleados por página
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida exitosamente
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
 *                 totalEmployees:
 *                   type: integer
 *                   example: 48
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19fabc"
 *                       names:
 *                         type: string
 *                         example: "María López"
 *                       email:
 *                         type: string
 *                         example: "maria@example.com"
 *                       salary:
 *                         type: number
 *                         example: 1500000
 *                       phone:
 *                         type: string
 *                         example: "+573102223334"
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "6720a5a9a8b7a8b45c19fxyz"
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos (solo administradores pueden acceder)
 *       500:
 *         description: Error interno al obtener la lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching paginated customers"
 */
router.get("/", authMiddleware, allowRoles("admin"), getAllEmployees);

/**
 * @swagger
 * /employees/save:
 *   post:
 *     summary: Registrar un nuevo empleado
 *     description: Crea un nuevo empleado en el sistema. Solo accesible para usuarios con rol `admin`. La contraseña se almacena de forma segura mediante hash.
 *     tags: [Empleados]
 *     security:
 *       - cookieAuth: []
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
 *               - salary
 *               - phone
 *               - locations
 *             properties:
 *               names:
 *                 type: string
 *                 example: "María López"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "ContraseñaSegura123"
 *               salary:
 *                 type: number
 *                 example: 1800000
 *               phone:
 *                 type: string
 *                 example: "+573102223334"
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID de la sede o ubicación donde trabaja el empleado
 *                   example: "6720a5a9a8b7a8b45c19f333"
 *     responses:
 *       201:
 *         description: Empleado registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "employee register successfully!"
 *                 body:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6720a5a9a8b7a8b45c19fabc"
 *                     names:
 *                       type: string
 *                       example: "María López"
 *                     email:
 *                       type: string
 *                       example: "maria@example.com"
 *                     salary:
 *                       type: number
 *                       example: 1800000
 *                     phone:
 *                       type: string
 *                       example: "+573102223334"
 *                     role:
 *                       type: string
 *                       example: "employee"
 *                     locations:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f333"
 *       400:
 *         description: Datos inválidos o faltantes en la solicitud
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos (solo administradores pueden acceder)
 *       500:
 *         description: Error interno al registrar el empleado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error ocurred saving the employee"
 */
router.post("/save", authMiddleware, allowRoles("admin"), saveEmployee);

router.get("/sede/:sede", authMiddleware, allowRoles("manager"), getAllBySede);

export default router
