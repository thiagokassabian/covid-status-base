const instance = axios.create({
	baseURL: 'https://api.covid19api.com/'
});

const getSummary = async () => {
	const response = await instance.get('summary')
	return response.data
}

const getCountries = async () => {
	const response = await instance.get('countries')
	return response.data
}

const getCountryAllStatus = async (country, dateStart, dateEnd) => {
	const response = await instance.get(`country/${country}?from=${dateStart}T00:00:00Z&to=${dateEnd}T00:00:00Z`)
	return response.data
}

//https://api.covid19api.com/country/south-africa?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z


export { getSummary, getCountries, getCountryAllStatus }