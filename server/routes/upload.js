const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')

//Default options
app.use(fileUpload())

app.put('/upload/:tipo/:id', (req, res) => {
  if (!req.files) {
    return res.status(400)
                .json({
                  ok: false,
                  err: {
                    message: 'No se encontraron archivos.'
                  }
                })
  }

  let tiposValidos = ['usuarios', 'productos']
  let tipo = req.params.tipo
  let id = req.params.id

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
        tipo
      }
    })
  }

  let extensionesValidas = ['jpg', 'gif', 'png']
  let archivo = req.files.archivo
  let nombreCortado = archivo.name.split('.')
  let extension = nombreCortado[nombreCortado.length - 1]

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
        exte: extension
      }
    })
  }

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (tipo === 'usuarios')
      imagenUsuario(id, res, nombreArchivo)
    else
      imagenProducto(id, res, nombreArchivo)
  })
})

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios')

      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios')

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      })
    }

    borrarArchivo(usuarioDB.img, 'usuarios')

    usuarioDB.img = nombreArchivo

    usuarioDB.save((err, usuarioGuardado) => {
      return res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })
  })
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'productos')

      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      borrarArchivo(nombreArchivo, 'productos')

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      })
    }

    borrarArchivo(productoDB.img, 'productos')

    productoDB.img = nombreArchivo

    productoDB.save((err, productoGuardado) => {
      return res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })
  })
}

function borrarArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen)
  }
}

module.exports = app
