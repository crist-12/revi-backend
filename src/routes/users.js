import { Router } from "express";
import {
  getVehicles,
  saveAssignment,
  doesAssignmentExist,
  getGroupsAndOptions,
  getVehicleById,
  getAllUsers,
  getAllDetails,
  getConductor,
  saveImages,
  saveDetails
} from "../controllers/asignaciones";
import multer from "multer";



const router = Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'temp')
  },
  filename: (req, file, cb)=> {
      cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer( { storage: fileStorageEngine })

/**
 * @swagger
 * components:
 *  schemas:
 *    Vehicle:
 *      type: object
 *      properties:
 *        key:
 *          type: string
 *          description: Código del Vehículo
 *        label:
 *          type: string
 *          description: Placa del Vehículo
 *        VehAno:
 *          type: int
 *          description: Año del vehículo
 *        VehMarca:
 *          type: string
 *          description: Marca del Vehículo
 *        VehColor:
 *          type: string
 *          description: Color del vehículo
 *        VehModelo:
 *          type: string
 *          description: Modelo del vehículo
 *        VehTipoCombustible:
 *          type: string
 *          description: Tipo de combustible del vehículo
 *        VehKilometraje:
 *          type: int
 *          description: Kilometraje del vehículo hasta la última actualización
 *    Conductores:
 *      type: object
 *      properties: 
 *        key:
 *          type: string
 *          description: Nombre completo del conductor
 *        label:
 *          type: string
 *          description: Código del conductor
 *        NombreUbicacion:
 *          type: string
 *          description: Ubicación del conductor
 * tags:
 *  name: Vehiculos
 *  description: API - Vehículos
 */

/**
 * @swagger
 * /vehiculos:
 *  get:
 *    summary: Obtiene los registros de todos los vehículos
 *    description: Obtiene un listado de los vehiculos registrados en la base de datos
 *    tags: [Vehiculos]
 */
router.get("/vehiculos", getVehicles);

/**
 * @swagger
 * /groups:
 *  get:
 *    summary: Obtiene los registros de todos los grupos y opciones de respuesta.
 *    description: Al evaluar el vehículo, lo evaluamos en varios aspectos como el Interior, Exterior, Motor y Carrocería, esta API trae los items a evaluar por cada uno de los aspectos.
 *    tags: [Vehiculos]
 */
 router.get("/groups", getGroupsAndOptions);

/**
 * @swagger
 * /vehiculos/id={id}:
 *  get:
 *    summary: Obtiene los registros de todos los vehículos
 *    parameters:
 *      - in: query
 *        name: id
 *        type: integer
 *        required: true
 *        description: Id del vehículo
 *    description: Obtiene un listado de los vehiculos registrados en la base de datos
 *    tags: [Vehiculos]
 */
 router.get("/vehiculos/id=:id", getVehicleById);


 /**
 * @swagger
 * /vehiculos/userId={userId}&vehCode={vehCode}:
 *  get:
 *    summary: Obtiene los registros de todos los vehículos
 *    parameters:
 *      - in: query
 *        name: userId
 *        type: integer
 *        required: true
 *        description: Id del usuario
 *      - in: query
 *        name: vehCode
 *        type: integer
 *        required: true
 *        description: Código del vehículo
 *    description: Corrobora si la asignación que quiere hacer ya existe
 *    tags: [Vehiculos]
 */
router.get("/vehiculos/userId=:userId&vehCode=:vehCode", doesAssignmentExist);

 /**
 * @swagger
 * /saveimages/id={id}:
 *  post:
 *    summary: Guarda en la base de datos las imágenes
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: formData
 *        name: images
 *        type: array
 *        required: true
 *        description: Imágenes procesadas en base64  
 *    description: Toma las imágenes encodificadas en base64, las convierte en archivos reales jpg almacenadas en una carpeta TEMP, de forma asíncrona sube las imágenes al cliente FTP para luego eliminar las imágenes de nuestra carpeta TEMP.
 *    tags: [Imágenes]
 */
router.post('/saveimages/id=:id', saveImages)


/**
 * @swagger
 * /users:
 *  get:
 *    summary: Obtiene el listado de todos los usuarios registrados en el sistema
 *    tags: [Conductores]
 */
 router.get("/users", getAllUsers);

 /**
 * @swagger
 * /details:
 *  get:
 *    summary: Obtiene todos los items que vamos a evaluar de los vehículos
 *    tags: [Grupos y Recursos]
 */
  router.get("/details", getAllDetails);

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Seleccionar los datos de un determinado usuario
 *    tags: [Conductores]
 */
 router.get("/users/id=:id", getConductor);



/**
 * @swagger
 * /assignment:
 *  post:
 *    summary: Guarda los datos de la asignación en el sistema
 *    tags: [Asignación]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: formData
 *        name: CodigoUsuario
 *        type: string
 *        required: true
 *        description: Código del conductor
 *      - in: formData
 *        name: CodigoVehiculo
 *        type: int
 *        required: true
 *        description: Código del vehículo
 *      - in: formData
 *        name: KilometrajeRecibido
 *        type: int
 *        required: true
 *        description: Kilometraje del automóvil a la hora de hacer la asignación
 *      - in: formData
 *        name: ProximoCambio
 *        type: string
 *        required: true
 *        description: Fecha o descripción del próximo cambio de aceite
 *      - in: formData
 *        name: TanqueCombustible
 *        schema:
 *          type: string
 *          enum: [E, 1/4, 1/2, 3/4, F]
 *        required: true
 *        description: Estado en el que recibe el tanque de combustible
 */
 router.post("/assignment", saveAssignment);


 /**
 * @swagger
 * /details:
 *  post:
 *    summary: save a new Task
 *    tags: [Asignación]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: formData
 *        name: IdAsignacion
 *        type: int
 *        required: true
 *        description: Código de la Asignación, generada por la API /assignment
 *      - in: formData
 *        name: CodigoGrupoRecurso
 *        type: string
 *        required: true
 *        description: Código del grupo de recursos, representa el aspecto a evaluar (INT, EXT, MTR, CAR)
 *      - in: formData
 *        name: CodigoOpcionRecurso
 *        type: int
 *        required: true
 *        description: Código del item específico a evaluar por cada uno de los grupos disponibles
 *      - in: formData
 *        name: Respuesta
 *        schema:
 *          type: string
 *          enum: [MALO, REGULAR, EXCELENTE]
 *        required: true
 *        description: Evaluación del item a evaluar
 */
  router.post("/details", saveDetails);


export default router;
