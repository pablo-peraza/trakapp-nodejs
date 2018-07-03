import express from "express";
import { Types } from "mongoose";
import modCliente from "../modelos/cliente.js";
import rutasGenericas from "./_base.js";
import { skipLimitABS } from "../comun-db.js";

const router = express.Router();

router.get("/buscar/:txt", buscarClientes);

async function buscarClientes(req, res) {
  const query = [
    {
      $project: {
        nombreCompleto: { $concat: ["$nombre", " ", "$apellidos"] },
        borrado: 1,
        cuenta: 1,
        nombre: 1,
        apellidos: 1,
      },
    },
    {
      $match: {
        nombreCompleto: { $regex: req.params.txt, $options: "gi" },
        borrado: false,
        cuenta: Types.ObjectId(req.cuenta),
      },
    },
  ];
  const abs = skipLimitABS(req.query);
  try {
    const docs = await modCliente
      .aggregate(query)
      .skip(abs.total)
      .limit(abs.cantidad);
    return res.json(docs);
  } catch (e) {
    return res.status(500).end();
  }
}

rutasGenericas(router, modCliente);

export default router;
