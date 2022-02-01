import { Router } from "express";
import {
  deleteTask,
  getVehicles,
  getAllUsers,
  getAllDetails,
  saveTask,
  getTask,
  updateTask,
  getTasksCount,
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
 * /tasks/count:
 *  get:
 *    summary: get total tasks counter
 *    tags: [Tasks]
 */
router.get("/tasks/count", getTasksCount);

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
