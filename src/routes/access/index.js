const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: Đăng ký người dùng
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email   
 *               - password
 *               - phone
 *             properties:
 *               fullname: 
 *                 type: string
 *                 example: Dinh Cong Thao
 *               username: 
 *                 type: string
 *                 example: dct
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: 0987654432
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu
 */

router.post('/sign-up', asyncHandler(accessController.signUp))

router.post('/verify-user', asyncHandler(accessController.verifyUser))

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     fullname:
 *                       type: string
 *                       example: "Dinh Cong Thao"
 *       400:
 *         description: Lỗi dữ liệu
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post('/login', asyncHandler(accessController.login))

router.use(authentication)

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Người dùng chưa đăng nhập hoặc token không hợp lệ
 */
router.post('/logout', accessController.logout)

module.exports = router