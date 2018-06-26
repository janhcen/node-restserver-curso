
const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

let app = express()

let Producto = require('../models/producto')

app.get('/producto', verificaToken, (req, res) => {
  let desde = Number(req.query.desde || 0)

  Producto.find({disponible: true})
      .skip(desde)
      .limit(5)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .sort({nombre: 1})
      .exec((err, productos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        return res.json({
          ok: true,
          productos
        })
      })
})

app.get('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id

  Producto.findById(id)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .exec((err, productoDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        if (!productoDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'El ID del producto no existe'
            }
          })
        }

        return res.json({
          ok: true,
          producto: productoDB
        })
      })
})

app.post('/producto', verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id
  })

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      producto: productoDB
    })
  })
})

app.put('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id
  let body = req.body

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      })
    }

    productoDB.nombre = body.nombre
    productoDB.precioUni = body.precioUni
    productoDB.descripcion = body.descripcion || null
    productoDB.categoria = body.categoria
    productoDB.usuario = req.usuario._id
    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      return res.json({
        ok: true,
        producto: productoGuardado
      })
    })
  })
})

app.delete('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID del producto no existe'
        }
      })
    }

    productoDB.disponible = false

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      return res.json({
        ok: true,
        producto: productoBorrado,
        message: 'El producto fue eliminado'
      })
    })
  })
})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino
  let expreg = new RegExp(termino, 'i')

  Producto.find({ nombre: expreg })
    .populate('categoria', 'descripcion')
    .sort({ nombre: 1 })
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }

      return res.json({
        ok: true,
        productos
      })
    })
})

module.exports = app

