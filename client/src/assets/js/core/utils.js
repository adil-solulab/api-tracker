const _token = localStorage.getItem('authToken')
let token
if (_token !== 'undefined') {
	token = JSON.parse(_token)
}
/** Toastr Configuration and method */
const ToastMsg = (msg, type) => {
	const _type = type.charAt(0).toLowerCase() + type.slice(1)

	const options = {
		closeButton: true,
		debug: false,
		newestOnTop: true,
		positionClass: 'toast-top-right',
		preventDuplicates: true,
		showDuration: '4000',
		hideDuration: '1000',
		timeOut: '5000',
		extendedTimeOut: '1000',
		showEasing: 'swing',
		hideEasing: 'linear',
		showMethod: 'fadeIn',
		hideMethod: 'fadeOut',
		progressBar: true,
	}
	return toastr[_type](msg, type, options)
}

const axiosConfig = (url, method = 'GET', data = {}, isImage = false) => {
	let headers = {
		authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
		// 'Access-Control-Allow-Origin': '*',
	}

	if (isImage) headers['Content-Type'] = 'multipart/form-data'
	const axiosPayload = {
		url: `${constant.BASE_URL}${url}`,
		method,
		data,
		headers,
	}
	return axiosPayload
}

const showLoadingBtn = (id) => {
	$(`#${id}`).text('')
	$(`#${id}`).attr('disabled', true)
	$(`#${id}`).append(
		`<div class="spinner-border text-primary" role="status">
		<span class="visually-hidden">Loading...</span>
	  </div>`
	)
}
const resetLoadingBtn = (id, btn = 'Submit', isIcon = false, icon = 'download') => {
	let text = ''
	switch (btn) {
		case 'login':
			text = 'Login'
			break
		case 'sendresetlink':
			text = 'Send Reset Link'
			break
		case 'resetpassword':
			text = 'Set new password'
			break
		case 'verifymyaccount':
			text = 'Verify My Account'
			break
		case 'resend':
			text = 'Resend'
			break
		case 'CreateFeatureBtn':
			text = 'Create Feature'
			break
		case 'UpdateBtn':
			text = 'Update'
			break
		case 'CreatePermissionBtn':
			text = 'Create Permission'
			break
		case 'deleteBtn':
			text = 'Delete'
			break

		default:
			text = btn
			break
	}
	$(`#${id}`).text(`${text}`)
	$(`#${id}`).prop('disabled', false)
	if (isIcon) {
		$(`#${id}`).prepend(`<i class="tf-icons mdi mdi-${icon} me-1"></i>`)
	}
	return
}

const MakeAPICall = async (config) => {
	try {
		const response = await axios(config)
		return response.data
	} catch (error) {
		if (error.response) {
			console.log(error.response.data)
			throw error.response.data.error.message
		} else if (error.request) {
			throw constant.RESPONSE_MESSSAGE.SERVER_ERROR
		} else {
			throw constant.RESPONSE_MESSSAGE.UNHANDLED_ERROR
		}
	}
}

const MaskEmail = (email) => {
	const maskid = email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c)
	return maskid
}

const GenerateButtons = (label, headingColor, borderColor, bodyBg, buttonObj) => {
	return [
		{
			extend: 'collection',
			className: 'btn btn-label-secondary dropdown-toggle me-3',
			text: '<i class="mdi mdi-export-variant me-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
			buttons: [
				{
					extend: 'print',
					text: '<i class="mdi mdi-printer-outline me-1" ></i>Print',
					className: 'dropdown-item',
					exportOptions: {
						columns: [1, 2, 3, 4, 5],
						// prevent avatar to be print
						format: {
							body: function (inner, coldex, rowdex) {
								if (inner.length <= 0) return inner
								var el = $.parseHTML(inner)
								var result = ''
								$.each(el, function (index, item) {
									if (item.classList !== undefined && item.classList.contains('user-name')) {
										result = result + item.lastChild.firstChild.textContent
									} else if (item.innerText === undefined) {
										result = result + item.textContent
									} else result = result + item.innerText
								})
								return result
							},
						},
					},
					customize: function (win) {
						//customize print view for dark
						$(win.document.body).css('color', headingColor).css('border-color', borderColor).css('background-color', bodyBg)
						$(win.document.body)
							.find('table')
							.addClass('compact')
							.css('color', 'inherit')
							.css('border-color', 'inherit')
							.css('background-color', 'inherit')
					},
				},
				{
					extend: 'csv',
					text: '<i class="mdi mdi-file-document-outline me-1" ></i>Csv',
					className: 'dropdown-item',
					exportOptions: {
						columns: [1, 2, 3, 4, 5],
						// prevent avatar to be display
						format: {
							body: function (inner, coldex, rowdex) {
								if (inner.length <= 0) return inner
								var el = $.parseHTML(inner)
								var result = ''
								$.each(el, function (index, item) {
									if (item.classList !== undefined && item.classList.contains('user-name')) {
										result = result + item.lastChild.firstChild.textContent
									} else if (item.innerText === undefined) {
										result = result + item.textContent
									} else result = result + item.innerText
								})
								return result
							},
						},
					},
				},
				{
					extend: 'excel',
					text: '<i class="mdi mdi-file-excel-outline me-1"></i>Excel',
					className: 'dropdown-item',
					exportOptions: {
						columns: [1, 2, 3, 4, 5],
						// prevent avatar to be display
						format: {
							body: function (inner, coldex, rowdex) {
								if (inner.length <= 0) return inner
								var el = $.parseHTML(inner)
								var result = ''
								$.each(el, function (index, item) {
									if (item.classList !== undefined && item.classList.contains('user-name')) {
										result = result + item.lastChild.firstChild.textContent
									} else if (item.innerText === undefined) {
										result = result + item.textContent
									} else result = result + item.innerText
								})
								return result
							},
						},
					},
				},
				{
					extend: 'pdf',
					text: '<i class="mdi mdi-file-pdf-box me-1"></i>Pdf',
					className: 'dropdown-item',
					exportOptions: {
						columns: [1, 2, 3, 4, 5],
						// prevent avatar to be display
						format: {
							body: function (inner, coldex, rowdex) {
								if (inner.length <= 0) return inner
								var el = $.parseHTML(inner)
								var result = ''
								$.each(el, function (index, item) {
									if (item.classList !== undefined && item.classList.contains('user-name')) {
										result = result + item.lastChild.firstChild.textContent
									} else if (item.innerText === undefined) {
										result = result + item.textContent
									} else result = result + item.innerText
								})
								return result
							},
						},
					},
				},
				{
					extend: 'copy',
					text: '<i class="mdi mdi-content-copy me-1"></i>Copy',
					className: 'dropdown-item',
					exportOptions: {
						columns: [1, 2, 3, 4, 5],
						// prevent avatar to be display
						format: {
							body: function (inner, coldex, rowdex) {
								if (inner.length <= 0) return inner
								var el = $.parseHTML(inner)
								var result = ''
								$.each(el, function (index, item) {
									if (item.classList !== undefined && item.classList.contains('user-name')) {
										result = result + item.lastChild.firstChild.textContent
									} else if (item.innerText === undefined) {
										result = result + item.textContent
									} else result = result + item.innerText
								})
								return result
							},
						},
					},
				},
			],
		},
		buttonObj
			? buttonObj
			: {
					text: `<i class="mdi mdi-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">${label}</span>`,
					className: 'add-new btn btn-primary',
					attr: {
						'data-bs-toggle': 'offcanvas',
						'data-bs-target': '#offcanvasAddUser',
					},
			  },
	]
}
const GenerateCustomDatatableButton = (name, type = 'offcanvas', targetModal = 'offcanvasAddUser', classname = 'primary', icon = 'plus', id) => {
	return {
		text: `<i class="mdi mdi-${icon} me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">${name}</span>`,
		className: `add-new btn btn-${classname}`,
		attr: {
			'data-bs-toggle': type,
			'data-bs-target': `#${targetModal}`,
			id,
		},
	}
}

const ValidateForm = (formElement, fieldValidators, rowSelector = '.mb-4') => {
	const fv = FormValidation.formValidation(formElement, {
		fields: fieldValidators,
		plugins: {
			declarative: new FormValidation.plugins.Declarative({
				html5Input: true,
			}),
			trigger: new FormValidation.plugins.Trigger(),
			bootstrap5: new FormValidation.plugins.Bootstrap5({
				eleValidClass: '',
				rowSelector: function (field, ele) {
					return rowSelector
				},
			}),
			// icon: new FormValidation.plugins.Icon({
			// 	valid: 'fa fa-check',
			// 	invalid: 'fa fa-times',
			// 	validating: 'fa fa-refresh',
			// }),
			submitButton: new FormValidation.plugins.SubmitButton(),
			autoFocus: new FormValidation.plugins.AutoFocus(),
		},
	})

	return fv
}

const InitializeSelect2 = (id, placeholder = 'Select', isClass = false) => {
	const select = $(`${isClass ? '.' : '#'}${id}`)
	if (select.length) {
		const $this = select
		select2Focus($this)
		$this.wrap('<div class="position-relative"></div>').select2({
			placeholder,
			dropdownParent: $this.parent(),
		})
	}
}

const PopulateSelectList = (dataArray = [], id, value = '_id', text = 'code', isEmpty = false, isClass = false) => {
	const select = $(`${isClass ? '.' : '#'}${id}`)
	if (isEmpty) {
		select.empty()
	}

	if (dataArray.length > 0) {
		dataArray.forEach((item) => {
			select.append(
				$('<option>', {
					value: item[value],
					text: item[text],
					id: item._id,
					class: 'form-control',
				})
			)
		})
	}
}
const PopulateStatusList = (dataArray = [], id, isEmpty = false) => {
	const select = $(`#${id}`)
	if (isEmpty) {
		select.empty()
	}

	if (dataArray.length > 0) {
		dataArray.forEach((item) => {
			select.append(
				$('<option>', {
					value: item.code,
					text: item.name,
					id: item._id,
					class: 'form-control',
				})
			)
		})
	}
}

const InitializeCleave = (inputElement) => {
	if (inputElement.length) {
		new Cleave(inputElement, {
			numeral: true,
			numeralPositiveOnly: false,
			numeralThousandsGroupStyle: 'none',
		})
	}
}

const InitializeDatepicker = (dateSelector, autoclose = false, startDate = false, multidate = false, endDate = undefined) => {
	if (dateSelector.length) {
		// Calculate 18 years ago from the current date
		// const eighteenYearsAgo = new Date()
		// eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
		const options = _.omitBy(
			{
				multidate,
				// startDate: startDate ? new Date() : false,
				endDate: new Date(), // Set the end date 18 years ago
				todayHighlight: true,
				orientation: isRtl ? 'auto right' : 'auto left',
				format: 'dd/mm/yyyy',
				clearBtn: true,
				autoclose,
			},
			_.isNil
		)

		dateSelector.datepicker(options)
	}
}

const InitializeDatetimepicker = (dateSelector) => {
	if (dateSelector.length) {
		dateSelector.flatpickr({
			enableTime: true,
			dateFormat: 'd/m/Y H:i',
			minuteIncrement: 1,
			time_24hr: true,
		})
	}
}
const s2ab = (s) => {
	var buf = new ArrayBuffer(s.length)
	var view = new Uint8Array(buf)
	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
	return buf
}

const StartRendering = (fnArray, interval) => {
	fnArray[0]()
	for (let i = 1; i < fnArray.length; i++) {
		setTimeout(fnArray[i], i * interval)
	}
}
function CalculateAmount(pricing, text) {
	let totalAmount = 0
	pricing.forEach((item) => {
		totalAmount +=
			item[text].baseFare +
			(item[text].totalTax || 0) +
			(item[text].atol || 0) +
			(item[text].safi || 0) +
			item[text].markUp +
			item[text].adminCharge +
			item[text].otherCharge
	})

	return totalAmount
}

const InitializeDateRangePicker = (selector, opens = 'left') => {
	selector.daterangepicker({
		autoclose: false,
		opens,
		drops: 'up',
		autoUpdateInput: false,
		locale: {
			cancelLabel: 'Clear',
			applyLabel: 'Submit',
			format: 'DD/MM/YYYY',
		},
	})
}
const GetBookingDisplayName = (bookingStatus) => {
	let displayName = 'Incomplete'
	switch (bookingStatus) {
		case 'cancelledClaimed':
			displayName = 'Cancelled Claimed'
			break
		case 'cancelledRefund':
			displayName = 'Cancelled Refund'
			break
		case 'refunndClaimed':
			displayName = 'Refund Claimed'
			break
		case 'followUp':
			displayName = 'Follow Up'
			break
		case 'reIssued':
			displayName = 'Re-Issued'
			break
		case 'paymentRecieved':
			displayName = 'Payment Recieved'
			break
		case 'creditNote':
			displayName = 'Credit Note'
			break
		case 'partialIssued':
			displayName = 'Partial Issued'
			break
		case 'issuedDeposit':
			displayName = 'Issued Deposit'
			break

		default:
			displayName = _.capitalize(bookingStatus)
			break
	}
	return displayName
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}
const GenerateColors = () => {
	const predefinedColors = ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#775DD0', '#FF7F00', '#9B59B6', '#E74C3C', '#1ABC9C', '#3498DB']
	return shuffleArray(predefinedColors.slice())
}
