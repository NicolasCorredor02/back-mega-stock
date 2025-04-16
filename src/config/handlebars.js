import { rootPath } from 'root/utils/paths.js'
import exphbs from 'express-handlebars'
import path from 'path'

function handlebarsConfig (app) {
  // Configuracion de layout default, directorio del layout y de los partials
  const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.resolve(rootPath, 'views', 'layouts'),
    partialsDir: path.resolve(rootPath, 'views', 'partials'),
    helpers: {
      toJSON: function (obj) {
        return JSON.stringify(obj).replace(/"/g, '&quot;')
      }
    }
  })

  app.engine('hbs', hbs.engine)
  app.set('view engine', '.hbs')
  app.set('views', path.resolve(rootPath, 'views'))
}

export default handlebarsConfig
