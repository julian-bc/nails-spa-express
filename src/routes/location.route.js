import { Router } from "express";
import { getAllLocations, addEmployeesToLocation, getLocationById } from "../controllers/location.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Obtener lista paginada de sedes
 *     description: Retorna una lista paginada de todas las sedes (locations) del sistema, incluyendo información básica de sus empleados y citas asociadas.
 *     tags: [Sedes]
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
 *         description: Cantidad de sedes por página
 *     responses:
 *       200:
 *         description: Lista de sedes obtenida exitosamente
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
 *                   example: 3
 *                 totalLocations:
 *                   type: integer
 *                   example: 25
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f555"
 *                       name:
 *                         type: string
 *                         example: "Sede Centro"
 *                       address:
 *                         type: string
 *                         example: "Cra 10 #20-15"
 *                       employees:
 *                         type: array
 *                         description: Lista de empleados asignados a la sede
 *                         items:
 *                           type: object
 *                           properties:
 *                             names:
 *                               type: string
 *                               example: "María López"
 *                             email:
 *                               type: string
 *                               example: "maria@example.com"
 *                       appointments:
 *                         type: array
 *                         description: Lista de citas registradas en la sede
 *                         items:
 *                           type: object
 *                           properties:
 *                             schedule:
 *                               type: object
 *                               properties:
 *                                 date:
 *                                   type: string
 *                                   example: "2025-11-10"
 *                                 start:
 *                                   type: string
 *                                   example: "09:00"
 *                                 end:
 *                                   type: string
 *                                   example: "10:00"
 *                             service:
 *                               type: string
 *                               example: "6720a5a9a8b7a8b45c19f111"
 *       500:
 *         description: Error interno al obtener las sedes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching paginated locations"
 */
router.get("/", getAllLocations);

/**
 * @swagger
 * /locations/{id}/employees:
 *   post:
 *     summary: Agregar empleados a una sede
 *     description: Agrega uno o varios empleados a una sede específica. Solo accesible para usuarios con rol `admin`. Si el empleado ya está asociado a la sede, se evita duplicación mediante `$addToSet`.
 *     tags: [Sedes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sede (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employees
 *             properties:
 *               employees:
 *                 type: array
 *                 description: Lista de IDs de los empleados que se desean asociar a la sede
 *                 items:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19e111"
 *                 example: ["6720a5a9a8b7a8b45c19e111", "6720a5a9a8b7a8b45c19e222"]
 *     responses:
 *       200:
 *         description: Empleados agregados exitosamente a la sede
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f555"
 *                 name:
 *                   type: string
 *                   example: "Sede Centro"
 *                 address:
 *                   type: string
 *                   example: "Cra 10 #20-15"
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       names:
 *                         type: string
 *                         example: "María López"
 *                       email:
 *                         type: string
 *                         example: "maria@example.com"
 *       404:
 *         description: Sede no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Location not found"
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos (solo administradores pueden acceder)
 *       500:
 *         description: Error interno al agregar empleados a la sede
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error adding employees to location"
 */
router.post("/:id/employees", authMiddleware, allowRoles("admin"), addEmployeesToLocation);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Obtener una sede por ID
 *     description: Retorna la información detallada de una sede específica, incluyendo sus empleados y citas asociadas.
 *     tags: [Sedes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sede (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Sede obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f555"
 *                 name:
 *                   type: string
 *                   example: "Sede Centro"
 *                 address:
 *                   type: string
 *                   example: "Cra 10 #20-15"
 *                 employees:
 *                   type: array
 *                   description: Lista de empleados asociados a la sede
 *                   items:
 *                     type: object
 *                     properties:
 *                       names:
 *                         type: string
 *                         example: "María López"
 *                       email:
 *                         type: string
 *                         example: "maria@example.com"
 *                 appointments:
 *                   type: array
 *                   description: Lista de citas registradas en la sede
 *                   items:
 *                     type: object
 *                     properties:
 *                       schedule:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2025-11-10"
 *                           start:
 *                             type: string
 *                             example: "09:00"
 *                           end:
 *                             type: string
 *                             example: "10:00"
 *                       service:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f111"
 *       404:
 *         description: Sede no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Location not found"
 *       500:
 *         description: Error interno al obtener la sede
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching location by ID"
 */
router.get("/:id", getLocationById);

export default router