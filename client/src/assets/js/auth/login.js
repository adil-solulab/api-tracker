$(document).ready(function () {
	const formAuthentication = document.getElementById('formAuthentication')
	const validators = {
		'email-username': {
			validators: {
				notEmpty: {
					message: 'Please enter email',
				},
				emailAddress: {
					message: 'Please enter a valid email address',
				},
			},
		},
		password: {
			validators: {
				notEmpty: {
					message: 'Please enter your password',
				},
				stringLength: {
					min: 3,
					message: 'Password must be more than 3 characters',
				},
			},
		},
	}

	const fv = ValidateForm(formAuthentication, validators, '.mb-3')
	fv.on('core.form.valid', async function () {
		showLoadingBtn('LoginBtn')
		ToastMsg('Authenticating', 'Info')
		const email = $('#EmailInput').val().trim()
		const password = $('#PasswordInput').val().trim()
		const requestParams = {
			method: 'POST',
			url: `${constant.BASE_URL}${constant.URLS.LOGIN}`,
			data: {
				email,
				password,
			},
		}
		try {
			const response = await MakeAPICall(requestParams)
			const { data } = response
			storage.setItem('authToken', JSON.stringify(data.items.token))
			storage.setItem('admin', JSON.stringify(data.items.existingUser))
			await MakeAPICall({
				method: 'POST',
				url: '/create-session',
				data: { token: data.items.token, user: data.items.existingUser },
			})
			window.location.href = '/reports'
		} catch (error) {
			toastr.clear()
			ToastMsg(error, 'Error')
		} finally {
			resetLoadingBtn('LoginBtn', 'Login')
		}
	})
})
