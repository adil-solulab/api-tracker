import express from 'express'

const router = express.Router()

const render = (routeName: string, views: string, data = {}, layout = null) => {
	router.get(routeName, (req, res) => {
		return res.render(views, { data, layout })
	})
}

router.use((req, res, next) => {
	if (!req.session?.user) return res.redirect('/')
	return next()
})
// super-admin routes
render('/reports', 'report/index', { active: 'report' })
render('/report/details', 'report/details', { active: 'report' })


export default router
