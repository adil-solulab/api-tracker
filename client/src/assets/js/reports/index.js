$(function () {
	const GetCompanyCodes = async () => {
		try {
			const response = await MakeAPICall(axiosConfig(`${constant.URLS.REPORTS}/company-codes`))
			const { items } = response.data
			console.log({ items })
			PopulateSelectList(items, 'CompanyCode', '_id', 'companyCode')
		} catch (error) {
			ToastMsg(error, 'Error')
		} finally {
			InitializeSelect2('CompanyCode')
		}
	}
	GetCompanyCodes()
	const leadDateFrom = $('#LeadDateFrom')
	const leadDateTo = $('#LeadDateTo')
	InitializeDatepicker(leadDateFrom, true, true)
	InitializeDatepicker(leadDateTo, true, true)

	// BIND TABLE
	const columnDefs = [
		{
			data: '_id.companyCode',
			render(data, type, row, meta) {
				let text = `<div class="" style="text-transform: capitalize;font-weight: 600;">${row._id.companyCode}</div>`
				return text
			},
		},
		{
			data: 'count',
			render(data, type, row, meta) {
				const colorClass =
					data >= 5000
						? 'bg-label-danger' // Red
						: data <= 500
						? 'bg-label-success' // Dark green
						: 'bg-label-warning' // Yellow

				const content = `<span style="font-weight: 600;" class="text-black badge ${colorClass} rectangle">${data}</span>`

				return content
			},
		},
		{
			data: 'count',
			render(data, type, row, meta) {
				let text
				let now = new Date()
				const t1 = new Date(moment(row._id.date, 'YYYY-MM-DD').startOf('day'))
				let t2 = new Date(moment(row._id.date, 'YYYY-MM-DD').endOf('day'))
				if (now.getFullYear() === t2.getFullYear() && now.getDate() === t2.getDate() && now.getMonth() === t2.getMonth()) {
					t2 = new Date()
				}

				const dif = Math.abs(new Date(t1).getTime() - new Date(t2).getTime()) / 1000
				text = row.count / Math.floor(dif)

				const colorClass =
					text >= 0.5
						? 'bg-label-danger' // Red
						: text <= 0.001
						? 'bg-label-success' // Dark green
						: 'bg-label-warning' // Yellow

				const content = `<span style="font-weight: 600;" class=" text-black badge ${colorClass} rectangle">${
					text.toFixed(3) === '0.000' ? 0 : text.toFixed(3)
				}/sec</span>`

				return content
			},
		},

		{
			data: '_id.date',
			render(data, type, row, meta) {
				return `<span style="font-weight: 600;" class="badge text-black bg-label-secondary rectangle">${moment(
					row._id.date,
					'YYYY-MM-DD'
				).format('DD MMM, YYYY')}</span>`
			},
		},

		{
			orderable: false,
			render(data, type, row, meta) {
				let text = `<div class='action-btn'>
								<a href="report/details?companyCode=${row._id.companyCode}&startDate=${row._id.date}"><i data-toggle="tooltip" data-placement="top" title="View" class="fa fa-eye" aria-hidden="true"></i></a>
							   `
				return text
			},
		},
	]
	const datatableURL = {
		url: `${constant.BASE_URL}${constant.URLS.REPORTS}`,
		type: 'GET',
	}
	const LoadDatatable = () =>
		initiateDatatable({
			tableId: 'Datatable',
			ajaxConfig: datatableURL,
			columnDefs,
			columns: columnDefs,
			sorting: 3,
		})
	LoadDatatable()

	$('#SearchLeadBtn').on('click', function () {
		const params = {
			companyCode: $('#CompanyCode').val(),
			startDate: $('#LeadDateFrom').val(),
			endDate: $('#LeadDateTo').val(),
		}
		const dateKeys = ['startDate', 'endDate',]
		dateKeys.forEach((key) => {
			if (params[key]) {
				params[key] = moment(params[key], 'DD/MM/YYYY').utc().format()
			}
		})

		// Build the query string
		const queryString = Object.keys(params)
			.filter((key) => params[key]) // Filter out empty values
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`) // Encode parameters
			.join('&')

		// Redirect to the constructed URL
		console.log(queryString)
		datatableURL.url = `${constant.BASE_URL}${constant.URLS.REPORTS}?${queryString}`
		LoadDatatable()
	})
})
