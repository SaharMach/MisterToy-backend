import { logger } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'
import {config} from '../config/index.js'

export function requireAuth(req, res, next) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    req.loggedinUser = loggedinUser
  
    if (config.isGuestMode && !loggedinUser) {
      req.loggedinUser = { _id: '', fullname: 'Guest' }
      return next()
    }
    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    next()
  }

export async function requireAdmin(req, res, next) {
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }

    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    console.log('loggedinuser', loggedinUser);
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    next()
}
