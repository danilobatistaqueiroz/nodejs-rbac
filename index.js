const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

require('./console-colors')

app.use(bodyParser.urlencoded({ extended: true }))

const users = require('./users')
const posts = require('./posts')

const AccessControl = require('accesscontrol')

const usingArray = require('./using-array')
usingArray.checkPermissions(AccessControl, app, {'users':users, 'posts':posts})

const usingObjects = require('./using-objects')
usingObjects.checkPermissions(AccessControl, app, {'users':users, 'posts':posts})

const usingAttributes = require('./using-attributes')
usingAttributes.checkPermissions(AccessControl, app, {'users':users, 'posts':posts})

/****************************** se passa username and password no request headers authorization basic ******************************* */
app.listen(3000, () => console.log(`app is now running on port 3000`))
