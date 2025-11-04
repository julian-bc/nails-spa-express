import { Router } from "express";
import { 
    createAppointment,
    updateAppointment,
    getAvailabilityForServiceInLocation,
    getAppointments,
    getAppointmentsByEmployee, 
    getAppointmentsByUser,
    deleteAppointment 
    } from "../controllers/citas.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";


const router = Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Obtener todas las citas
 *     description: Retorna una lista de citas con filtros por fecha, estado de cancelación y paginación. Solo accesible para usuarios con rol `admin` o `employee`.
 *     tags: [Citas]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha exacta de las citas (YYYY-MM-DD)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango de búsqueda
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango de búsqueda
 *       - in: query
 *         name: cancelled
 *         schema:
 *           type: boolean
 *         description: Filtra citas canceladas o activas
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 32
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                 filter:
 *                   type: object
 *                   description: Filtros aplicados a la búsqueda
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f123"
 *                       service:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Manicure Spa"
 *                           price:
 *                             type: number
 *                             example: 35000
 *                       employee:
 *                         type: object
 *                         properties:
 *                           names:
 *                             type: string
 *                             example: "María López"
 *                           phone:
 *                             type: string
 *                             example: "+573102223334"
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Sede Centro"
 *                           address:
 *                             type: string
 *                             example: "Cra 10 #20-15"
 *                       user:
 *                         type: object
 *                         properties:
 *                           names:
 *                             type: string
 *                             example: "Laura Gómez"
 *                       schedule:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2025-10-25"
 *                           start:
 *                             type: string
 *                             example: "10:00"
 *                           end:
 *                             type: string
 *                             example: "11:00"
 *                       cancelled:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Error en los parámetros o formato de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener citas."
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos (rol distinto a admin o employee)
 */
router.get("/", authMiddleware, allowRoles("admin", "employee"), getAppointments);

/**
 * @swagger
 * /appointments/employee/{id}:
 *   get:
 *     summary: Obtener citas por empleado
 *     description: Retorna una lista paginada de citas asociadas a un empleado específico. Solo accesible para usuarios con rol `admin` o `employee`.
 *     tags: [Citas]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado (ObjectId de MongoDB)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha exacta de las citas (YYYY-MM-DD)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango de búsqueda
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango de búsqueda
 *       - in: query
 *         name: cancelled
 *         schema:
 *           type: boolean
 *         description: Filtra citas canceladas o activas
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de citas del empleado obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 12
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                 filter:
 *                   type: object
 *                   description: Filtros aplicados a la búsqueda
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f123"
 *                       service:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Pedicure Spa"
 *                           price:
 *                             type: number
 *                             example: 42000
 *                       employee:
 *                         type: object
 *                         properties:
 *                           names:
 *                             type: string
 *                             example: "María López"
 *                           phone:
 *                             type: string
 *                             example: "+573102223334"
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Sede Norte"
 *                           address:
 *                             type: string
 *                             example: "Av. 9 #45-10"
 *                       user:
 *                         type: object
 *                         properties:
 *                           names:
 *                             type: string
 *                             example: "Laura Gómez"
 *                       schedule:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2025-10-26"
 *                           start:
 *                             type: string
 *                             example: "15:00"
 *                           end:
 *                             type: string
 *                             example: "16:00"
 *                       cancelled:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Error en la solicitud o ID de empleado inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID de empleado inválido."
 *       401:
 *         description: No autorizado — el usuario no está autenticado
 *       403:
 *         description: Prohibido — el usuario no tiene permisos (rol distinto a admin o employee)
 */
router.get("/employee/:id", authMiddleware, allowRoles("admin", "employee"), getAppointmentsByEmployee);

/**
 * @swagger
 * /appointments/user/{id}:
 *   get:
 *     summary: Obtener citas por usuario
 *     description: Retorna una lista paginada de citas asociadas a un usuario específico. Este endpoint está disponible sin restricción de roles.
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario (ObjectId de MongoDB)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha exacta de las citas (YYYY-MM-DD)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango de búsqueda
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango de búsqueda
 *       - in: query
 *         name: cancelled
 *         schema:
 *           type: boolean
 *         description: Filtra citas canceladas o activas
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de citas del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 8
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                 filter:
 *                   type: object
 *                   description: Filtros aplicados a la búsqueda
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f456"
 *                       service:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Manicure Deluxe"
 *                           price:
 *                             type: number
 *                             example: 50000
 *                       employee:
 *                         type: object
 *                         properties:
 *                           names:
 *                             type: string
 *                             example: "María López"
 *                           phone:
 *                             type: string
 *                             example: "+573103332221"
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Sede Sur"
 *                           address:
 *                             type: string
 *                             example: "Calle 45 #10-22"
 *                       user:
 *                         type: object
 *                         properties:
 *                           names:
 *                             type: string
 *                             example: "Laura Gómez"
 *                       schedule:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2025-11-02"
 *                           start:
 *                             type: string
 *                             example: "09:30"
 *                           end:
 *                             type: string
 *                             example: "10:30"
 *                       cancelled:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Error en la solicitud o ID de usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID de usuario inválido."
 *       500:
 *         description: Error interno al obtener las citas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener citas por usuario."
 */
router.get("/user/", authMiddleware, getAppointmentsByUser);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Crear una nueva cita
 *     description: Crea una nueva cita en el sistema, validando conflictos de horario, disponibilidad del empleado y formato de los datos. Solo accesible para usuarios con rol `admin` o `employee`.
 *     tags: [Citas]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service
 *               - location
 *               - schedule
 *               - user
 *             properties:
 *               service:
 *                 type: string
 *                 description: ID del servicio asociado a la cita
 *                 example: "6720a5a9a8b7a8b45c19f111"
 *               employee:
 *                 type: string
 *                 nullable: true
 *                 description: ID del empleado asignado (opcional)
 *                 example: "6720a5a9a8b7a8b45c19f222"
 *               location:
 *                 type: string
 *                 description: ID de la sede o ubicación donde se realizará la cita
 *                 example: "6720a5a9a8b7a8b45c19f333"
 *               schedule:
 *                 type: object
 *                 description: Información de fecha y horario de la cita
 *                 required:
 *                   - date
 *                   - start
 *                   - end
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-05"
 *                   start:
 *                     type: string
 *                     example: "09:00"
 *                   end:
 *                     type: string
 *                     example: "10:30"
 *               additionalDescription:
 *                 type: string
 *                 nullable: true
 *                 description: Descripción adicional proporcionada por el usuario
 *                 example: "Cliente pidió esmaltado francés."
 *               user:
 *                 type: string
 *                 description: ID del usuario que agenda la cita
 *                 example: "6720a5a9a8b7a8b45c19f444"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita creada exitosamente."
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6720a5a9a8b7a8b45c19f999"
 *                     service:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Pedicure Spa"
 *                         price:
 *                           type: number
 *                           example: 45000
 *                     employee:
 *                       type: object
 *                       properties:
 *                         names:
 *                           type: string
 *                           example: "María López"
 *                         phone:
 *                           type: string
 *                           example: "+573102223334"
 *                     location:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Sede Norte"
 *                         address:
 *                           type: string
 *                           example: "Av. 9 #45-10"
 *                     user:
 *                       type: object
 *                       properties:
 *                         names:
 *                           type: string
 *                           example: "Laura Gómez"
 *                     schedule:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           example: "2025-11-05"
 *                         start:
 *                           type: string
 *                           example: "09:00"
 *                         end:
 *                           type: string
 *                           example: "10:30"
 *                     additionalDescription:
 *                       type: string
 *                       nullable: true
 *                       example: "Cliente pidió esmaltado francés."
 *                     cancelled:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todos los campos requeridos deben ser proporcionados."
 *       409:
 *         description: Conflicto de horario con una cita existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conflicto de horario con una cita existente."
 *                 conflicts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f222"
 *                       start:
 *                         type: string
 *                         example: "09:00"
 *                       end:
 *                         type: string
 *                         example: "10:00"
 *       500:
 *         description: Error interno al crear la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al crear la cita."
 */
router.post("/", authMiddleware, createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Actualizar una cita existente
 *     description: Actualiza los datos de una cita (servicio, empleado, ubicación, horario, descripción, etc.) con validaciones de integridad, conflictos de horario y referencias cruzadas. Solo accesible para usuarios con rol `admin` o `employee`.
 *     tags: [Citas]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita a actualizar (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service:
 *                 type: string
 *                 description: ID del servicio
 *                 example: "6720a5a9a8b7a8b45c19f111"
 *               employee:
 *                 type: string
 *                 description: ID del empleado asignado
 *                 example: "6720a5a9a8b7a8b45c19f222"
 *               location:
 *                 type: string
 *                 description: ID de la sede o ubicación
 *                 example: "6720a5a9a8b7a8b45c19f333"
 *               user:
 *                 type: string
 *                 description: ID del usuario asociado
 *                 example: "6720a5a9a8b7a8b45c19f444"
 *               schedule:
 *                 type: object
 *                 description: Nuevo horario de la cita
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-06"
 *                   start:
 *                     type: string
 *                     example: "14:00"
 *                   end:
 *                     type: string
 *                     example: "15:30"
 *               additionalDescription:
 *                 type: string
 *                 nullable: true
 *                 example: "Cambio de color solicitado por el cliente."
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita actualizada exitosamente."
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6720a5a9a8b7a8b45c19f999"
 *                     service:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Manicure Spa"
 *                         price:
 *                           type: number
 *                           example: 35000
 *                     employee:
 *                       type: object
 *                       properties:
 *                         names:
 *                           type: string
 *                           example: "María López"
 *                         phone:
 *                           type: string
 *                           example: "+573102223334"
 *                     location:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Sede Centro"
 *                         address:
 *                           type: string
 *                           example: "Cra 10 #20-15"
 *                     user:
 *                       type: object
 *                       properties:
 *                         names:
 *                           type: string
 *                           example: "Laura Gómez"
 *                     schedule:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           example: "2025-11-06"
 *                         start:
 *                           type: string
 *                           example: "14:00"
 *                         end:
 *                           type: string
 *                           example: "15:30"
 *                     additionalDescription:
 *                       type: string
 *                       example: "Cambio de color solicitado por el cliente."
 *                     cancelled:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El ID del servicio no es válido."
 *       404:
 *         description: Cita no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita no encontrada."
 *       409:
 *         description: Conflicto de horario con otra cita existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conflicto de horario con otra cita existente."
 *                 conflicts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19f222"
 *                       start:
 *                         type: string
 *                         example: "13:00"
 *                       end:
 *                         type: string
 *                         example: "14:00"
 *       500:
 *         description: Error interno al actualizar la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la cita."
 */
router.put("/:id", authMiddleware, updateAppointment);

/**
 * @swagger
 * /appointments/availability:
 *   post:
 *     summary: Obtener disponibilidad de citas para un servicio en una sede
 *     description: Calcula los horarios disponibles de los empleados que pueden realizar un servicio específico en una sede dada, para una fecha determinada. Excluye automáticamente las horas de almuerzo (12:00–14:00) y cita los espacios libres en intervalos de 30 minutos.
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idLocation
 *               - idService
 *               - date
 *             properties:
 *               idLocation:
 *                 type: string
 *                 description: ID de la sede o ubicación
 *                 example: "6720a5a9a8b7a8b45c19f333"
 *               idService:
 *                 type: string
 *                 description: ID del servicio solicitado
 *                 example: "6720a5a9a8b7a8b45c19f111"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha para la cual se desea consultar la disponibilidad (formato YYYY-MM-DD)
 *                 example: "2025-11-10"
 *     responses:
 *       200:
 *         description: Disponibilidad calculada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2025-11-10"
 *                 location:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f333"
 *                 service:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f111"
 *                 serviceDuration:
 *                   type: integer
 *                   description: Duración del servicio en minutos
 *                   example: 60
 *                 availability:
 *                   type: array
 *                   description: Lista de empleados con sus franjas horarias disponibles
 *                   items:
 *                     type: object
 *                     properties:
 *                       employeeId:
 *                         type: string
 *                         example: "6720a5a9a8b7a8b45c19e222"
 *                       employeeName:
 *                         type: string
 *                         example: "María López"
 *                       availableSlots:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "09:00"
 *       400:
 *         description: Datos inválidos o formato incorrecto en los IDs o la fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fecha inválida. Formato esperado: YYYY-MM-DD."
 *       404:
 *         description: Servicio o sede no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Servicio o sede no encontrados."
 *       500:
 *         description: Error interno al calcular la disponibilidad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al calcular disponibilidad."
 */
router.post("/availability", getAvailabilityForServiceInLocation);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Cancelar (eliminar) una cita
 *     description: Elimina una cita existente del sistema si pertenece al usuario autenticado y no ha sido cancelada previamente. También actualiza la sede para remover la referencia de la cita.
 *     tags: [Citas]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita a eliminar (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario que solicita la cancelación
 *                 example: "6720a5a9a8b7a8b45c19f444"
 *     responses:
 *       200:
 *         description: Cita cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita cancelada exitosamente."
 *                 appointmentId:
 *                   type: string
 *                   example: "6720a5a9a8b7a8b45c19f999"
 *       400:
 *         description: Error en los IDs o la cita ya ha sido cancelada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Esta cita ya ha sido cancelada."
 *       403:
 *         description: El usuario no tiene permisos para cancelar esta cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No tienes permiso para cancelar esta cita."
 *       404:
 *         description: Cita no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita no encontrada."
 *       500:
 *         description: Error interno al cancelar la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al cancelar la cita."
 */
router.delete("/:id", authMiddleware, deleteAppointment);

export default router