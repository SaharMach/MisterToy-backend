import express  from 'express'
import cookieParser from 'cookie-parser'
import cors  from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { logger } from './services/logger.service.js'
logger.info('server.js loaded...')

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173','http://127.0.0.1:3000', 'http://localhost:3000','http://localhost:5174'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { setupSocketAPI } from './services/socket.service.js'


// routes
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
app.use('/api/review', reviewRoutes)
setupSocketAPI(server)



// Make every unmatched server-side-route fall back to index.html
// So when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

// import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030
server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})
























// OLD SERVER!

// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'

// import { toyService } from './services/toy.service.js'
// import { loggerService } from './services/logger.service.js';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const app = express()


// // App Configuration
// const corsOptions = {
//     origin: [
//         'http://127.0.0.1:8080',
//         'http://localhost:8080',
//         'http://127.0.0.1:5173',
//         'http://localhost:5173',
//         'http://127.0.0.1:5174',
//         'http://localhost:5174',
//     ],
//     credentials: true
// }

// app.use(cors(corsOptions))
// app.use(cookieParser()) // for res.cookies
// app.use(express.json()) // for req.body
// app.use(express.static('public'))



// app.get('/api/toy', (req, res) => {
//     const { txt,inStock,labels,sortBy } = req.query
//     const filterBy = { txt,inStock,labels,sortBy }
//     toyService.query(filterBy)
//         .then(toys => {
//             res.send(toys)
//         })
//         .catch(err => {
//             loggerService.error('Cannot load cars', err)
//             res.status(400).send('Cannot load cars')
//         })
// })

// // Add
// app.post('/api/toy', (req, res) => {
//     const { name, price } = req.body
//     const toy = toyService.getEmptyToy(name,price)
//     toyService.save(toy)
//         .then(savedToy => {
//             res.send(savedToy)
//         })
//         .catch(err => {
//             loggerService.error('Cannot add toy', err)
//             res.status(400).send('Cannot add toy')
//         })
// })

// // Edit
// app.put('/api/toy', (req, res) => {
//     const { name, price, _id } = req.body
//     const toy = {
//         _id,
//         name,    
//         price: +price,
//     }
//     toyService.save(toy)
//         .then((savedToy) => {
//             res.send(savedToy)
//         })
//         .catch(err => {
//             loggerService.error('Cannot update toy', err)
//             res.status(400).send('Cannot update toy')
//         })
// })

// // Read - getById
// app.get('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.get(toyId)
//         .then(toy => {
//             res.send(toy)
//         })
//         .catch(err => {
//             loggerService.error('Cannot get toy', err)
//             res.status(400).send(err)
//         })
// })

// // Remove
// app.delete('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.remove(toyId)
//         .then(msg => {
//             res.send({ msg, toyId })
//         })
//         .catch(err => {
//             loggerService.error('Cannot delete toy', err)
//             res.status(400).send('Cannot delete toy, ' + err)
//         })
// })


// // // **************** Users API ****************:
// // app.get('/api/auth/:userId', (req, res) => {
// //     const { userId } = req.params
// //     userService.getById(userId)
// //         .then(user => {
// //             res.send(user)
// //         })
// //         .catch(err => {
// //             loggerService.error('Cannot get user', err)
// //             res.status(400).send('Cannot get user')
// //         })
// // })

// // app.post('/api/auth/login', (req, res) => {
// //     const credentials = req.body
// //     userService.checkLogin(credentials)
// //         .then(user => {
// //             const token = userService.getLoginToken(user)
// //             res.cookie('loginToken', token)
// //             res.send(user)
// //         })
// //         .catch(err => {
// //             loggerService.error('Cannot login', err)
// //             res.status(401).send('Not you!')
// //         })
// // })

// // app.post('/api/auth/signup', (req, res) => {
// //     const credentials = req.body
// //     userService.save(credentials)
// //         .then(user => {
// //             const token = userService.getLoginToken(user)
// //             res.cookie('loginToken', token)
// //             res.send(user)
// //         })
// //         .catch(err => {
// //             loggerService.error('Cannot signup', err)
// //             res.status(401).send('Nope!')
// //         })
// // })


// // app.post('/api/auth/logout', (req, res) => {
// //     res.clearCookie('loginToken')
// //     res.send('logged-out!')
// // })


// // app.put('/api/user', (req, res) => {
// //     const loggedinUser = userService.validateToken(req.cookies.loginToken)
// //     if (!loggedinUser) return res.status(401).send('No logged in user')
// //     const { diff } = req.body
// //     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
// //     loggedinUser.score += diff
// //     return userService.save(loggedinUser).then(user => {
// //         const token = userService.getLoginToken(user)
// //         res.cookie('loginToken', token)
// //         res.send(user)
// //     })
// // })


// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })



// // Listen will always be the last line in our server!
// const port = process.env.PORT || 3030
// app.listen(port, () => {
//     loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
// })

