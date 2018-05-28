
process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/jcafe'
} else {
  urlDB = 'mongodb://jcafe-user:123456@ds137740.mlab.com:37740/jcafe'
}

process.env.URLDB = urlDB
