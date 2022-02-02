import { connectrvfleet, connectrvseguridad } from "../database";

export const getVehicles = async (req, res) => {
  const connection = await connectrvfleet();
  const [rows] = await connection.execute("SELECT VehCodigoVehiculo, VehPlaca, VehAno, VehMarca, VehColor, VehModelo, VehTipoCombustible FROM vehiculos");
  res.json(rows);
};

export const getVehicleById= async (req, res) => {
  const connection = await connectrvfleet();
  const rows = await connection.execute("SELECT VehCodigoVehiculo, VehPlaca, VehAno, VehMarca, VehColor, VehModelo, VehTipoCombustible FROM vehiculos WHERE VehCodigoVehiculo = ?", [
    req.params.id,
  ]);
  res.json(rows[0]);
};

export const getAllUsers = async (req, res) => {
  const connection = await connectrvseguridad();
  const [rows] = await connection.execute("SELECT A.IdUsuario, A.NombreUsuario FROM usuario AS A JOIN ubicacion AS B ON A.IdUbicacion = B.IdUbicacion");
  res.json(rows);
};

export const getAllDetails = async (req, res) => {
  const connection = await connectrvseguridad();
  const [rows] = await connection.execute("SELECT * FROM gruporecurso AS A JOIN opcionrecurso AS B ON A.IdGrupoRecurso = B.IdGrupoRecurso WHERE A.Estatus = 1 AND B.Estatus = 1");
  res.json(rows);
};

export const getConductor = async (req, res) => {
  const connection = await connectrvseguridad();
  const rows = await connection.execute("SELECT A.IdUsuario, A.NombreUsuario, b.NombreUbicacion FROM usuario AS A JOIN ubicacion AS B ON A.IdUbicacion = B.IdUbicacion WHERE A.IdUsuario = ?", [
    req.params.id,
  ]);
  res.json(rows[0]);
};


export const saveTask = async (req, res) => {
  try {
    const connection = await connect();
    const [results] = await connection.execute(
      "INSERT INTO tasks(title, description) VALUES (?, ?)",
      [req.body.title, req.body.description]
    );

    const newUser = {
      id: results.insertId,
      ...req.body,
    };
    res.json(newUser);
  } catch (error) {
    console.error(error);
  }
};

export const getTask = async (req, res) => {
  const connection = await connect();
  const rows = await connection.execute("SELECT * FROM tasks WHERE id = ?", [
    req.params.id,
  ]);
  res.json(rows[0][0]);
};

export const deleteTask = async (req, res) => {
  const connection = await connect();
  const result = await connection.execute("DELETE FROM tasks WHERE id = ?", [
    req.params.id,
  ]);
  console.log(result);

  res.sendStatus(204);
};

export const updateTask = async (req, res) => {
  const connection = await connect();
  await connection.query("UPDATE tasks SET ? WHERE id = ?", [
    req.body,
    req.params.id,
  ]);
  res.sendStatus(204);
};

export const getTasksCount = async (req, res) => {
  const connection = await connect();
  const [rows] = await connection.execute("SELECT COUNT(*) FROM tasks");
  res.json(rows[0]["COUNT(*)"]);
};
