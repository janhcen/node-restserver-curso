
process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 *30

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollador'


let urlDB

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/jcafe'
} else {
  urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

process.env.CLIENT_ID = process.env.CLIENT_ID || '3978616044-7467590fhpirrcq9k6446eic7lvfkd2m.apps.googleusercontent.com'
