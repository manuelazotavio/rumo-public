import express from 'express'
import loginUser from '../controllers/auth/loginUser.js'
import loginEmpresa from '../controllers/auth/loginEmpresa.js'
import logout from '../controllers/auth/logout.js'
import auth from '../middlewares/auth.js'
import refreshToken from '../controllers/auth/refreshToken.js'
import validToken from '../middlewares/validToken.js'
import requestClaimEmpresa from '../controllers/auth/requestClaimEmpresa.js'
import forgotPassword from '../controllers/auth/forgotPassword.js'
import resetPassword from '../controllers/auth/resetPassword.js'
import { setPassword } from '../controllers/auth/setPassword.js'

const router = express.Router()

router.post('/login/empresa', loginEmpresa)
router.post('/login/user', loginUser)
router.post('/verify-token', validToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/logout', auth, logout)
router.post("/set-password", setPassword);
router.post('/refresh-token', refreshToken)
router.post('/request-claim-empresa', requestClaimEmpresa)

export default router