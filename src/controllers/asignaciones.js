import { connectrvfleet, connectrvseguridad } from "../database";

export const getVehicles = async (req, res) => {
  const connection = await connectrvfleet();
  const [rows] = await connection.execute("SELECT VehCodigoVehiculo AS 'key', VehPlaca AS 'label', VehAno, VehMarca, VehColor, VehModelo, VehTipoCombustible, VehKilometraje FROM vehiculos");
  res.json(rows);
};

export const getVehicleById= async (req, res) => {
  const connection = await connectrvfleet();
  const rows = await connection.execute("SELECT VehCodigoVehiculo, VehPlaca, VehAno, VehMarca, VehColor, VehModelo, VehTipoCombustible, VehKilometraje FROM vehiculos WHERE VehCodigoVehiculo = ?", [
    req.params.id,
  ]);
  res.json(rows[0]);
};

export const getAllUsers = async (req, res) => {
  const connection = await connectrvseguridad();
  const [rows] = await connection.execute("SELECT A.IdUsuario AS 'key', A.NombreUsuario AS 'label', B.NombreUbicacion FROM usuario AS A JOIN ubicacion AS B ON A.IdUbicacion = B.IdUbicacion");
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

export const doesAssignmentExist = async (req, res) => {
  const connection = await connectrvfleet();
  const [rows] = await connection.execute("SELECT COUNT(*) AS 'Cantidad' FROM usuariovehiculo WHERE IdUsuario = ? AND CodigoVehiculo = ?", [
    req.params.userId,
    req.params.vehCode
  ]);
  res.json(rows);
};

export const getGroupsAndOptions = async(req, res) => {
  let arre = []
  const connection = await connectrvseguridad();
  const [groups] = await connection.execute("SELECT IdGrupoRecurso FROM gruporecurso WHERE IdGrupoRecurso IN ('ASI_DET_EXTERIOR', 'ASI_DET_INTERIOR', 'ASI_DET_MOTOR', 'ASI_DET_CARROCERIA') AND Estatus = 1");
  const [rows] = await connection.execute("SELECT A.IdGrupoRecurso, B.IdOpcionRecurso, A.NombreGrupoRecurso,  B.NombreOpcionRecurso FROM gruporecurso AS A JOIN opcionrecurso AS B ON A.IdGrupoRecurso = B.IdGrupoRecurso WHERE B.IdGrupoRecurso IN ('ASI_DET_EXTERIOR', 'ASI_DET_INTERIOR', 'ASI_DET_MOTOR', 'ASI_DET_CARROCERIA') AND B.Estatus = 1 ORDER BY IdGrupoRecurso, CAST(IdOpcionRecurso AS SIGNED) ASC");
  groups.forEach((element)=> {
    var obj = {
      IdGrupoRecurso : "",
      opciones: []
    }
    obj.IdGrupoRecurso = element.IdGrupoRecurso;
    obj.opciones = rows.filter(x => x.IdGrupoRecurso == element.IdGrupoRecurso)
   // console.log(obj.opciones)
    arre.push(obj);
    
  })


  arre.forEach(item => {
    console.log(item.opciones)
  })
  res.json(arre);
}



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

export const saveAssignment = async(req, res) => {
  try {
    const connection = await connectrvfleet();
    const [results] = await connection.execute(
      "INSERT INTO asignacionvehiculorespuesta(CodigoUsuario, CodigoVehiculo, KilometrajeRecibido, ProximoCambio, TanqueCombustible, ObservacionesTanqueCombustible) VALUES (?, ?, ?, ?, ?, ?)",
      [req.body.CodigoUsuario, req.body.CodigoVehiculo, req.body.KilometrajeRecibido, req.body.ProximoCambio, req.body.TanqueCombustible, req.body.ObservacionesTanqueCombustible]
    );

    const newUser = {
      id: results.insertId,
      ...req.body,
    };
    res.json(newUser);
  } catch (error) {
    console.error(error);
  }
}

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

