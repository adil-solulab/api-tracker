const formAuthentication = $('#ForgotPasswordForm')

document.addEventListener('DOMContentLoaded', function (e) {
	e.preventDefault()
	const fv = FormValidation.formValidation(formAuthentication[0], {
		fields: {
			email: {
				validators: {
					notEmpty: {
						message: 'Please enter email',
					},
					emailAddress: {
						message: 'Please enter a valid email address',
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
		showLoadingBtn('ForgotPasswordBtn')
		const email = $('#EmailInput').val().trim()
		const requestParams = {
			method: 'POST',
			url: `${constant.BASE_URL}${constant.URLS.FORGOT_PASSWORD}`,
			data: { email },
		}

		try {
			const data = await MakeAPICall(requestParams)
			ToastMsg(data.data.message, 'Success')
		} catch (error) {
			ToastMsg(error, 'Error')
		} finally {
			resetLoadingBtn('ForgotPasswordBtn', 'sendresetlink')
		}
	})
})
