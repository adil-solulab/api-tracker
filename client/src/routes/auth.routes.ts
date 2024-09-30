import express, { Request } from 'express'

const router = express.Router()

router.post('/create-session', (req: Request, res) => {
	if (req.session) {
		req.session.user = req.body.user
		req.session.token = req.body.token
	}
	return res.redirect('/')
})

router.post('/destroy-session', (req, res) => {
	if (req.session) {
		req.session.destroy(() => {})
		res.redirect('/')
	}
})

router.get('/', (req, res) => {
	if (req.session?.user) {
		return res.redirect('/reports')
	}
	return res.render('auth/login', { layout: 'auth/login' })
})
router.get('/reset-password', (req, res) => {
	if (req.session?.user) {
		return res.redirect('/reports')
	}
	return res.render('auth/reset-password', { layout: 'auth/reset-password' })
})
router.get('/forgot-password', (req, res) => {
	if (req.session?.user) {
		return res.redirect('/reports')
	}
	return res.render('auth/forgot-password', { layout: 'auth/forgot-password' })
})

export default router
