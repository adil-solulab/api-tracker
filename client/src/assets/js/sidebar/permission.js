$(() => {
	axios(axiosConfig(constant.URLS.ME))
		.then((resp) => {
			const { items: data } = resp.data.data
			$('#CurrentUserName').text(data.fullName || data.name)
			$('#DashboardUsername').text(data.fullName || data.name)
			$('#CurrentUserRole').text('Super Admin')
		})
		.catch(async (e) => {
			if (e.response?.data?.error?.statusCode === 401) {
				console.log('tjois')
				await MakeAPICall({
					method: 'POST',
					url: '/destroy-session',
				})
				storage.clear()
				window.location.href = '/'
			} else ToastMsg(e.response?.data?.error?.message, 'Error')
		})
})
