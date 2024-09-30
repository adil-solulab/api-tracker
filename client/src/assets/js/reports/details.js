$(function () {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)

	const companyCode = urlParams.get('companyCode')
	const date = urlParams.get('startDate')
	const startDate = moment(date, 'YYYY-MM-DD').utc().format()
	// BIND TABLE
	const columnDefs = [
		{
			orderable: false,
			data: 'companyCode',
			render(data) {
				let text = `<div class="" style="text-transform: capitalize;font-weight: 600;">${data}</div>`
				return text
			},
		},
		{
			orderable: false,
			data: 'credentialCode',
			render(data) {
				return data
			},
		},
		{
			orderable: false,
			data: 'referralUrl',
			render(data) {
				return data
			},
		},
		{
			orderable: false,
			data: 'searchId',
			render(data) {
				return data
			},
		},
		{
			orderable: false,
			data: 'IP',
			render(data) {
				return data
			},
		},
		{
			data: 'origin',
			render(data) {
				return data
			},
		},
		{
			data: 'destination',
			render(data) {
				return data
			},
		},
		{
			orderable: false,
			data: 'classOfService',
			render(data) {
				let text = `<div class="" style="text-transform: capitalize;">${data}</div>`
				return text
			},
		},
		{
			orderable: false,
			data: 'currency',
			render(data) {
				return data
			},
		},
		{
			data: 'adults',
			render(data) {
				return data
			},
		},
		{
			data: 'child',
			render(data) {
				return data
			},
		},
		{
			data: 'infants',
			render(data) {
				return data
			},
		},

		{
			data: 'createdAt',
			render(data) {
				return `<span style="font-weight: 600;" class="badge text-black bg-label-secondary rectangle">${moment(data).format(
					'DD MMM, YYYY HH:mm'
				)}</span>`
			},
		},
	]
	const datatableURL = {
		url: `${constant.BASE_URL}${constant.URLS.REPORT_DETAILS}?companyCode=${companyCode}&startDate=${startDate}`,
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

	/// CHART
	let labelColor, headingColor, borderColor

	if (isDarkStyle) {
		labelColor = config.colors_dark.textMuted
		headingColor = config.colors_dark.headingColor
		bodyColor = config.colors_dark.bodyColor
		borderColor = config.colors_dark.borderColor
		currentTheme = 'dark'
	} else {
		labelColor = config.colors.textMuted
		headingColor = config.colors.headingColor
		bodyColor = config.colors.bodyColor
		borderColor = config.colors.borderColor
		currentTheme = 'light'
	}

	const commonLineBarChartOptions = {
		noData: {
			text: 'NO DATA',
		},
		series: [],
		stroke: {
			curve: 'smooth',
			// width: [0, 3],
			// lineCap: 'round',
		},
		legend: {
			show: false,
			position: 'bottom',
			markers: {
				width: 8,
				height: 8,
				offsetX: -3,
			},
			height: 40,
			offsetY: 10,
			itemMargin: {
				horizontal: 8,
				vertical: 0,
			},
			fontSize: '15px',
			fontFamily: 'Inter',
			fontWeight: 400,
			labels: {
				colors: headingColor,
				useSeriesColors: false,
			},
			offsetY: 10,
		},
		grid: {
			show: false,
			strokeDashArray: 8,
			borderColor,
		},
		colors: GenerateColors(),
		fill: {
			opacity: [1, 1],
		},

		dataLabels: {
			enabled: true,
		},
		xaxis: {
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},

		responsive: [],
		yaxis: {
			tickAmount: 4,
			min: 0,
			labels: {
				style: {
					colors: labelColor,
					fontSize: '13px',
					fontFamily: 'Inter',
					fontWeight: 400,
				},
				formatter: function (val) {
					return val
				},
			},
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return val // Customize the tooltip to show sales value
				},
			},
			x: {
				format: 'dd MMM yyyy', // Format the tooltip for x-axis
			},
		},
	}

	/**
	 * All Chart options - Configurations
	 */
	const destinationChartId = 'DestinationChart'
	const salesReportOptions = {
		...commonLineBarChartOptions,
		chart: {
			height: 280,
			type: 'line',
			stacked: false,
			parentHeightOffset: 0,
			toolbar: {
				show: true,
			},
			zoom: {
				enabled: true,
			},
		},
		plotOptions: {
			bar: {
				columnWidth: '40%',
				startingShape: 'rounded',
				endingShape: 'rounded',
				borderRadius: 4,
				distributed: true,
				// horizontal: true,
			},
		},
	}
	const IPReportChartId = 'IpReportChart'
	const bookingReportOptions = {
		...commonLineBarChartOptions,
		crosshairs: {
			fill: {
				type: 'gradient',
				gradient: {
					colorFrom: '#D8E3F0',
					colorTo: '#BED1E6',
					stops: [0, 100],
					opacityFrom: 0.4,
					opacityTo: 0.5,
				},
			},
		},
		chart: {
			height: 280,
			type: 'line',
		},
	}

	/**
	 * Initialize all the charts
	 */
	InitializeChart({ chartId: destinationChartId, url: `graph-data?companyCode=${companyCode}&startDate=${startDate}`, options: salesReportOptions })
	InitializeChart({
		chartId: IPReportChartId,
		url: `graph-data?companyCode=${companyCode}&startDate=${startDate}&groupBy=$IP`,
		options: bookingReportOptions,
	})
})
