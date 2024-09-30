const email = getWithExpiration('tempLogin')
$(document).ready(function () {
	const urlParams = new URLSearchParams(window.location.search)
	const token = urlParams.get('token')
	if (!token) {
		window.location.href = '/'
	}
	const formAuthentication = $('#ResetPasswordForm')
	formAuthentication.submit((e) => {
		e.preventDefault()
		const fv = FormValidation.formValidation(formAuthentication[0], {
			fields: {
				password: {
					validators: {
						notEmpty: {
							message: 'Please enter your password',
						},
						stringLength: {
							min: 6,
							message: 'Password must be more than 6 characters',
						},
					},
				},
				'confirm-password': {
					validators: {
						notEmpty: {
							message: 'Please confirm the password',
						},
						identical: {
							compare: function () {
								return formAuthentication.find('[name="password"]').val()
							},
							message: 'The password and its confirmation are not the same',
						},
						stringLength: {
							min: 6,
							message: 'Password must be more than 6 characters',
						},
					},
				},
			},
			plugins: {
				trigger: new FormValidation.plugins.Trigger(),
				bootstrap5: new FormValidation.plugins.Bootstrap5({
					eleValidClass: '',
					rowSelector: '.mb-3',
				}),
				submitButton: new FormValidation.plugins.SubmitButton(),
				// defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
				autoFocus: new FormValidation.plugins.AutoFocus(),
			},
			init: (instance) => {
				instance.on('plugins.message.placed', function (e) {
					if (e.element.parentElement.classList.contains('input-group')) {
						e.element.parentElement.insertAdjacentElement('afterend', e.messageElement)
					}
				})
			},
		}).on('core.form.valid', async function () {
			showLoadingBtn('ResetPasswordBtn')
			const password = $('#PasswordInput').val().trim()
			let data = {
				password,
				confirmPassword: password,
				domain: window.location.hostname,
			}
			if (email) {
				data = {
					...data,
					email,
					isFirstTimeLogin: true,
				
				}
			}
			const requestParams = {
				method: 'PATCH',
				url: `${constant.BASE_URL}${constant.URLS.RESET_PASSWORD}?token=${token}`,
				data,
			}

			try {
				const data = await MakeAPICall(requestParams)
				if (data) {
					storage.removeItem('tempLogin')
					ToastMsg(data?.message, 'Success')
					setTimeout(() => {
						window.location.href = '/dashboard'
					}, 1000)
				}
			} catch (error) {
				ToastMsg(error, 'Error')
			} finally {
				resetLoadingBtn('ResetPasswordBtn', 'resetpassword')
			}
		})
	})
})
