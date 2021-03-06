import { connectrvfleet, connectrvseguridad } from "../database";
import Client from "ftp";
import fs from 'fs'
import fs2 from 'fs-extra'
const base64Img = require("base64-img")



const c = new Client();

export const getVehicles = async (req, res) => {
  const connection = await connectrvfleet();
  const [rows] = await connection.execute("SELECT VehCodigoVehiculo AS 'key', VehPlaca AS 'label', VehAno, VehMarca, VehColor, VehModelo, VehTipoCombustible, VehKilometraje FROM vehiculos");
  await connection.end();
  res.json(rows);

};

export const getVehicleById = async (req, res) => {
  const connection = await connectrvfleet();
  const rows = await connection.execute("SELECT VehCodigoVehiculo, VehPlaca, VehAno, VehMarca, VehColor, VehModelo, VehTipoCombustible, VehKilometraje FROM vehiculos WHERE VehCodigoVehiculo = ?", [
    req.params.id,
  ]);
  await connection.end();
  res.json(rows[0]);
};

export const getAllUsers = async (req, res) => {
  const connection = await connectrvseguridad();
  const [rows] = await connection.execute("SELECT A.IdUsuario AS 'key', A.NombreUsuario AS 'label', B.NombreUbicacion FROM usuario AS A JOIN ubicacion AS B ON A.IdUbicacion = B.IdUbicacion");
  await connection.end();
  res.json(rows);
};

export const getAllDetails = async (req, res) => {
  const connection = await connectrvseguridad();
  const [rows] = await connection.execute("SELECT * FROM gruporecurso AS A JOIN opcionrecurso AS B ON A.IdGrupoRecurso = B.IdGrupoRecurso WHERE A.Estatus = 1 AND B.Estatus = 1");
  await connection.end();
  res.json(rows);
};

export const getConductor = async (req, res) => {
  const connection = await connectrvseguridad();
  const rows = await connection.execute("SELECT A.IdUsuario, A.NombreUsuario, b.NombreUbicacion FROM usuario AS A JOIN ubicacion AS B ON A.IdUbicacion = B.IdUbicacion WHERE A.IdUsuario = ?", [
    req.params.id,
  ]);
  await connection.end();
  res.json(rows[0]);
};

export const doesAssignmentExist = async (req, res) => {
  const connection = await connectrvfleet();
  const [rows] = await connection.execute("SELECT COUNT(*) AS 'Cantidad' FROM usuariovehiculo WHERE IdUsuario = ? AND CodigoVehiculo = ?", [
    req.params.userId,
    req.params.vehCode
  ]);
  await connection.end();
  res.json(rows);
};

export const getGroupsAndOptions = async (req, res) => {
  let arre = []
  const connection = await connectrvseguridad();
  const [groups] = await connection.execute("SELECT IdGrupoRecurso FROM gruporecurso WHERE IdGrupoRecurso IN ('ASI_DET_EXTERIOR', 'ASI_DET_INTERIOR', 'ASI_DET_MOTOR', 'ASI_DET_CARROCERIA') AND Estatus = 1");
  const [rows] = await connection.execute("SELECT A.IdGrupoRecurso, B.IdOpcionRecurso, A.NombreGrupoRecurso,  B.NombreOpcionRecurso FROM gruporecurso AS A JOIN opcionrecurso AS B ON A.IdGrupoRecurso = B.IdGrupoRecurso WHERE B.IdGrupoRecurso IN ('ASI_DET_EXTERIOR', 'ASI_DET_INTERIOR', 'ASI_DET_MOTOR', 'ASI_DET_CARROCERIA') AND B.Estatus = 1 ORDER BY IdGrupoRecurso, CAST(IdOpcionRecurso AS SIGNED) ASC");
  groups.forEach((element) => {
    var obj = {
      IdGrupoRecurso: "",
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
  await connection.end();
  res.json(arre);
}

export const saveImages = async (req, res) => {
  try {
    const types = ['DELANTERA', 'TRASERA', 'LAT-IZQ', 'LAT-DER', 'INTERIOR', 'OBS']
    const connection = await connectrvfleet();
    c.on('ready', function () {

      req.body.forEach((item, index) => {
        if (index == 5) {
          item.forEach((img, indice) => {
            const destpath = 'temp/'
            const filename = types[index] + "-IMG-" + Date.now() + ".jpg";
            const buffer = Buffer.from(img, "base64");
            let localpath = destpath + filename
            fs.writeFileSync(destpath + filename, buffer)

            c.put(destpath + filename, '/Asignaciones/' + filename, function (err, list) {
              if (err) console.log(err);
              let path = '/Asignaciones/' + filename;

              let result = connection.execute("INSERT INTO asignacionvehiculofotos(CodAsignacion, TipoFoto, PathFoto) VALUES (?, ?, ?)", [req.params.id, types[index], path])
              fs.unlinkSync(localpath)
              c.end();
            })
          })
        } else {
          const destpath = 'temp/'
          const filename = types[index] + "-IMG-" + Date.now() + ".jpg";
          const buffer = Buffer.from(req.body[index], "base64");
          let localpath = destpath + filename
          fs.writeFileSync(destpath + filename, buffer)

          c.put(destpath + filename, '/Asignaciones/' + filename, function (err, list) {
            if (err) console.log(err);
            let path = '/Asignaciones/' + filename;

            let result = connection.execute("INSERT INTO asignacionvehiculofotos(CodAsignacion, TipoFoto, PathFoto) VALUES (?, ?, ?)", [req.params.id, types[index], path])
            /* try {
              fs.unlinkSync(localpath)
            } catch (error) {
              console.log("Algo sali?? mal al eliminar el archivo "+localpath)
            } */
            c.end();
          })

          fs2.emptyDir('temp')
          .then((res)=> {
            console.log("Archivos eliminados exitosamente")
          })
          .catch((err)=> {
            console.log("Algo ocurri?? mientras eliminabamos los archivos")
          })
        }
      })
    });

    c.connect({
      host: "192.168.1.2",
      user: "RV-USUARIO",
      password: "P@ssw0rd"
    });


    res.send({ message: "Archivos subidos exitosamente" });
  } catch (error) {
    res.send({ message: "Ocurri?? un error al subir los archivos" })
  }
}

export const saveDetails = async (req, res) => {
  try {
    const connection = await connectrvfleet();
    const [results] = await connection.execute(
      "INSERT INTO asignacionvehiculorespuestadetalle(IdAsignacion, CodigoGrupoRecurso, CodigoOpcionRecurso, Respuesta) VALUES (?, ?, ?, ?)",
      [req.body.IdAsignacion, req.body.CodigoGrupoRecurso, req.body.CodigoOpcionRecurso, req.body.Respuesta]
    )
    res.json(results)
  } catch (error) {
    console.log(error)
  }
}

export const saveAssignment = async (req, res) => {
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
    connection.end();
    res.json(results)
  } catch (error) {
    console.error(error);
  }
}

