import { Router } from "express";
import {
  deleteTask,
  getVehicles,
  getAllUsers,
  getAllDetails,
  getVehicleById,
  getConductor,
  saveTask,
  getTask,
  updateTask,
  doesAssignmentExist,
  getGroupsAndOptions
} from "../controllers/asignaciones";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: the auto-generated id of task
 *        title:
 *          type: string
 *          description: the task title
 *        description:
 *          type: string
 *          description: the task description
 * tags:
 *  name: Tasks
 *  description: tasks endpoint
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
 * /vehiculos:
 *  get:
 *    summary: Obtiene los registros de todos los vehículos
 *    description: Obtiene un listado de los vehiculos registrados en la base de datos
 *    tags: [Vehiculos]
 */
 router.get("/groups", getGroupsAndOptions);

/**
 * @swagger
 * /vehiculos:
 *  get:
 *    summary: Obtiene los registros de todos los vehículos
 *    description: Obtiene un listado de los vehiculos registrados en la base de datos
 *    tags: [Vehiculos]
 */
 router.get("/vehiculos/id=:id", getVehicleById);


 /**
 * @swagger
 * /vehiculos:
 *  get:
 *    summary: Obtiene los registros de todos los vehículos
 *    description: Obtiene un listado de los vehiculos registrados en la base de datos
 *    tags: [Vehiculos]
 */
  router.get("/vehiculos/userId=:userId&vehCode=:vehCode", doesAssignmentExist);





/**
 * @swagger
 * /tasks:
 *  get:
 *    summary: Get all Tasks
 *    tags: [Tasks]
 */
 router.get("/users", getAllUsers);

 /**
 * @swagger
 * /tasks:
 *  get:
 *    summary: Get all Tasks
 *    tags: [Tasks]
 */
  router.get("/details", getAllDetails);

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Seleccionar los datos de un determinado usuario
 *    tags: [Tasks]
 */
 router.get("/users/id=:id", getConductor);


/**
 * @swagger
 * /tasks:
 *  post:
 *    summary: save a new Task
 *    tags: [Tasks]
 */
router.post("/tasks", saveTask);

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *    summary: Get task by Id
 *    tags: [Tasks]
 */
router.get("/tasks/:id", getTask);

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *    summary: delete a task by Id
 *    tags: [Tasks]
 */
router.delete("/tasks/:id", deleteTask);

/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    summary: update a task by Id
 *    tags: [Tasks]
 */
router.put("/tasks/:id", updateTask);

export default router;
