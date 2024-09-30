/****** Styling for utility buttons in datatable *****/
let borderColor, bodyBg, headingColor

if (isDarkStyle) {
	borderColor = config.colors_dark.borderColor
	bodyBg = config.colors_dark.bodyBg
	headingColor = config.colors_dark.headingColor
} else {
	borderColor = config.colors.borderColor
	bodyBg = config.colors.bodyBg
	headingColor = config.colors.headingColor
}
const GenerateUtilityButtons = (columns = [1, 2, 3, 4, 5, 6, 7, 8, 9]) => {
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
						columns,
						// prevent avatar to be print
						// format: {
						// 	body: function (inner, coldex, rowdex) {
						// 		if (inner.length <= 0) return inner
						// 		var el = $.parseHTML(inner)
						// 		var result = ''
						// 		$.each(el, function (index, item) {
						// 			if (
						// 				item.classList !== undefined &&
						// 				item.classList.contains('user-name')
						// 			) {
						// 				result = result + item.lastChild.firstChild.textContent
						// 			} else if (item.innerText === undefined) {
						// 				result = result + item.textContent
						// 			} else result = result + item.innerText
						// 		})
						// 		return result
						// 	},
						// },
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
						columns,
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
						columns,
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
						columns,
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
						columns,
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
	]
}
/****** Styling for utility buttons in datatable *****/

const constant = {
	// BASE_URL: 'https://vkbw8m66-8080.inc1.devtunnels.ms/api/v1/admin/',
	BASE_URL: 'https://vkc4vf99-5000.inc1.devtunnels.ms/api/v1/',
	URLS: {
		LOGIN: 'auth/sign-in',
		LOGOUT: 'auth/sign-out',
		FORGOT_PASSWORD: 'auth/forgot-password',
		RESET_PASSWORD: 'auth/reset-password',
		REPORTS: 'reports',	
		REPORT_DETAILS: 'reports/details',	
		ME: 'me'
	},
	RESPONSE_MESSSAGE: {
		SERVER_ERROR: 'No response from server. Please try after sometime.',
		UNHANDLED_ERROR: 'An error occurred while sending the request. Please try again later.',
	},
	/** Datables constants */
	DATATABLE: {
		DOM:
			'<"row mx-2"' +
			'<"col-md-2"<"me-3"l>>' +
			'<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0 gap-3"fB>>' +
			'>t' +
			'<"row mx-2"' +
			'<"col-sm-12 col-md-6"i>' +
			'<"col-sm-12 col-md-6"p>' +
			'>',
		RESPONSIVENESS: {
			details: {
				display: $.fn.dataTable.Responsive.display.modal({
					header: function (row) {
						var data = row.data()
						return `Details of <span class='text-capitalize'>${data['name']}</span>`
					},
				}),
				type: 'column',
				renderer: function (api, rowIdx, columns) {
					var data = $.map(columns, function (col, i) {
						return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
							? '<tr data-dt-row="' +
									col.rowIndex +
									'" data-dt-column="' +
									col.columnIndex +
									'">' +
									'<td>' +
									col.title +
									':' +
									'</td> ' +
									'<td>' +
									col.data +
									'</td>' +
									'</tr>'
							: ''
					}).join('')

					return data ? $('<table class="table"/><tbody />').append(data) : false
				},
			},
		},
		BUTTONS: GenerateUtilityButtons(),
		COLUMN_DEFS: [
			{
				// For Responsive
				className: 'control',
				searchable: false,
				orderable: false,
				responsivePriority: 2,
				targets: 0,
				data: '_id',
				render: function (data, type, full, meta) {
					return ''
				},
			},
		],
	},
	PERMISSIONS: {
		LEAD: ['new lead', 'search leads'],
		DOCKET: ['new docket', 'search docket', 'manual docket', 'import api'],
		FARE_MANAGER: ['markup', 'meta clicks', 'meta search logs', 'gfs markup', 'meta compare', 'call only offer', 'flight offers'],
		REPORTS: ['activity tracker', 'deposit due report', 'lead report', 'net profit report', 'supplier payment report'],
		ADMIN_SETTING: ['docket deposit due', 'search transaction', 'supplier', 'supplier payment', 'campaign', 'brand'],
		SETTING: [
			'user',
			'role',
			'pnr convertor api',
			'mail template',
			'change air timings',
			'airline priority',
			'replace airline',
			'allowed destination',
			'blocked destination',
		],
	},
	ACTIVE_MENU: {
		LEAD: ['new-lead', 'search-lead'],
		DOCKET: ['new-docket', 'search-docket', 'manual-docket', 'import-api'],
		FARE_MANAGER: ['markup', 'meta-click', 'meta-search-log', 'gfs-markup', 'meta-compare', 'call-only-offer', 'flight-offer'],
		REPORT: ['activity-log', 'deposit-due-report', 'lead-report', 'net-profit', 'supplier-payment-report'],
		ADMIN_SETTING: ['admin-deposit-due', 'admin-search-transaction', 'admin-supplier-payment', 'admin-brand', 'admin-campaign', 'admin-supplier'],
		SETTING: [
			'setting-user',
			'setting-role',
			'setting-whitelist-ip',
			'allowed-destination',
			'blocked-destination',
			'pnr-convertor-api',
			'mail-template',
			'change-air-timing',
			'replace-airline',
			'setting-smtp',
		],
	},
}
