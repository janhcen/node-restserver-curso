const express = require('express')
const Categoria = require('../models/categoria')
const app = express()
const _ = require('underscore')
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')


app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({}, 'descripcion usuario')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        categorias
      })
    })
});

app.get('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id

  Categoria.findOne({ '_id': id }, 'descripcion usuario')
    .exec((err, categoria) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        categoria
      })
    })
});

app.post('/categoria', verificaToken, function (req, res) {

  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  })

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

app.put('/categoria/:id', [verificaToken], function (req, res) {

  let id = req.params.id
  let body = _.pick(req.body, ['descripcion'])

  Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })
  })
})

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
  let id = req.params.id

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: categoriaDB
    })
  })
})

module.exports = app


