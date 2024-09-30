const InitializeChart = async ({ chartId, url, options }) => {
	const chart = new ApexCharts(document.querySelector(`#${chartId}`), options)
	chart.render()
	if (url) {
		try {
			const response = await MakeAPICall(axiosConfig(`${constant.URLS.REPORTS}/${url}`))
			const { items } = response.data
			console.log({items})
			if (options.chart.type === 'pie') {
				chart.updateSeries(items.length > 0 ? items[0].series : [])
				chart.updateOptions({
					labels: items.length > 0 ? items[0].labels : [],
					// colors: GenerateColors(items.length),
				})
			} else {
				chart.updateSeries(items)
				
			}
		} catch (error) {
			console.error(error)
			ToastMsg(error, 'Error')
		}
	}
}
