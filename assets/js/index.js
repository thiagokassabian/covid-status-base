import * as http from "./http.js";

let summary

let kpiConfirmedEl = document.getElementById('confirmed')
let kpiDeathEl = document.getElementById('death')
let kpiRecoveredEl = document.getElementById('recovered')

let graphicPieEl = document.getElementById('pizza')
let graphicBarEl = document.getElementById('barras')

const init = () => {
	http.getSummary().then(result => {
		summary = result
		console.log(summary)

		renderKpi()
		renderGraphicPie()

		renderGraphicTopDeaths(topCountries('TotalDeaths', 15))

	})
}

const renderKpi = () => {
	kpiConfirmedEl.innerText = (summary.Global.TotalConfirmed).toLocaleString()
	kpiDeathEl.innerText = (summary.Global.TotalDeaths).toLocaleString()
	kpiRecoveredEl.innerText = (summary.Global.TotalRecovered).toLocaleString()

	const lastUpdate = document.querySelector('#date')
	lastUpdate.append(summary.Date)
}

const renderGraphicPie = () => {
	const labels = ['Confirmados', 'Mortes', 'Recuperados']
	const data = {
		labels,
		datasets: [{
			label: 'Distribuição de novos casos',
			data: [summary.Global.NewConfirmed, summary.Global.NewDeaths, summary.Global.NewRecovered],
			backgroundColor: [
				'rgb(255, 99, 132)',
				'rgb(54, 162, 235)',
				'rgb(255, 205, 86)'
			]
		}]
	}
	const config = {
		type: 'pie',
		data: data
	}

	new Chart(graphicPieEl, config)
}

const topCountries = (property, max) => {
	let countries = summary.Countries
	countries.sort((a, b) => b[property] - a[property])
	return countries.slice(0, max)
}

const renderGraphicTopDeaths = countries => {
	let labels = []
	let values = []
	for (const country of countries) {
		labels.push(country.Country)
		values.push(country.TotalDeaths)
	}


	const data = {
		labels: labels,
		datasets: [{
			label: 'Total de mortes por país',
			data: values,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)'
			],
			borderColor: [
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)'
			],
			borderWidth: 1
		}]
	};

	const config = {
		type: 'bar',
		data: data,
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		},
	};

	new Chart(graphicBarEl, config)
}

init()