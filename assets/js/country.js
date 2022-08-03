import * as http from './http.js'

const formEl = document.querySelector('form');
const dateStartEl = document.getElementById('date_start');
dateStartEl.max = getPreviousDate();
const dateEndEl = document.getElementById('date_end');
dateEndEl.max = getPreviousDate();
const cmbCountriesEl = document.getElementById('cmbCountry');
const cmbStatusEl = document.getElementById('cmbData');

const graphicArea = document.getElementById('linhas');

const initalCountry = 'brazil';
const initialDateStart = 15;

// Configuração do gráfico
const data = {
	datasets: [{
		label: 'Diário',
		borderColor: ['rgb(255, 99, 132)']
	}, {
		label: 'Média',
		borderColor: ['rgb(54, 162, 235)']
	}]
};
const config = {
	type: 'line',
	data
};

let myChart = new Chart(graphicArea, config);

formEl.addEventListener('submit', event => {
	event.preventDefault()
	getCountryAllStatus(cmbCountriesEl.value, getPreviousDate(1, new Date(dateStartEl.value)), dateEndEl.value)
});

(async function () {
	// Consulta todos os países
	// Renderiza a combo ordenados pelo nome
	// Seta os valores iniciais do formulário	
	http.getCountries().then(countries => {
		renderCmbCountries(countries.sort((a, b) => a.Country.localeCompare(b.Country)))
		setInitialValues(initalCountry, initialDateStart)
	})

	// Consulta os dados do Brasil
	getCountryAllStatus(initalCountry, getPreviousDate(initialDateStart + 1), getPreviousDate(1))
})();

function setInitialValues(country, dateStart, dateEnd) {
	dateStartEl.value = getPreviousDate(dateStart)
	dateEndEl.value = getPreviousDate(dateEnd)
	cmbCountriesEl.value = country
}

async function getCountryAllStatus(country, dateStart, dateEnd) {
	return await http.getCountryAllStatus(country, dateStart, dateEnd).then(response => renderGraph(response))
}

function renderGraph(dates) {
	console.log(dates)

	const totalConfirmed = dates.map(date => date.Confirmed)
	const totalRecovered = dates.map(date => date.Recovered)
	const totalDeaths = dates.map(date => date.Deaths)

	document.getElementById('kpiconfirmed').innerText = (totalConfirmed[totalConfirmed.length - 1] - totalConfirmed[0]).toLocaleString()
	document.getElementById('kpideaths').innerText = (totalDeaths[totalDeaths.length - 1] - totalDeaths[0]).toLocaleString()
	document.getElementById('kpirecovered').innerText = (totalRecovered[totalRecovered.length - 1] - totalRecovered[0]).toLocaleString()

	console.log(totalConfirmed, totalRecovered, totalDeaths)

	let labels = []
	let values = []
	let daily = []

	for (const date of dates) {
		labels.push(date.Date.slice(0, 10))
		if (values.length > 0) {
			daily.push(date[cmbStatusEl.value] - values[values.length - 1])
		}
		values.push(date[cmbStatusEl.value])
	}

	const average = Array.from(Array(daily.length), () => Math.round(daily.reduce((a, b) => a + b) / daily.length))
	console.log('Média', average)

	labels.shift() // Retira do array o dia anterior ao escolhido
	values.shift() // Retira do array o dia anterior ao escolhido

	console.log('Datas', labels)
	console.log('Total', values)
	console.log('Diário', daily)
	console.log('Somatório', daily.reduce((a, b) => a + b))

	data.labels = labels
	data.datasets[0].data = daily
	data.datasets[1].data = average

	console.log(config)

	myChart.update()
}

function renderCmbCountries(countries) {
	for (const country of countries) {
		let option = document.createElement('option')
		option.value = country.Slug
		option.textContent = country.Country
		cmbCountriesEl.append(option)
	}
}

function getPreviousDate(daysBefore = 1, date = new Date()) {
	const previous = new Date(date.getTime());
	previous.setDate(date.getDate() - daysBefore);
	return previous.toISOString().split("T")[0];
}
