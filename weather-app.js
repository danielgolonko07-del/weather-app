const grid = document.getElementById('grid')

let place

let temperatureChart = null


const placeInput = document.createElement('input')
placeInput.type = 'text'
placeInput.placeholder = 'Enter city'
if (placeInput.value === '') {
    clicked = false
}

const searchHistory = document.createElement('div')

const searchBtn = document.createElement('button')
searchBtn.textContent = 'Search'
searchBtn.addEventListener('click', () => {
    place = placeInput.value
    fetchData()
})
placeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        place = placeInput.value
        fetchData()
    }
})


const forecast = document.createElement('div')

const city = document.createElement('div')

const tempDisplay = document.createElement('div')

const chartCanvas = document.createElement('canvas')

const description = document.createElement('div')

const wind = document.createElement('div')

const rainfall = document.createElement('div')

const pressure = document.createElement('div')


async function fetchData() {

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=1&language=pl&format=json`)
    const data = await response.json()

    if (!data.results || data.results.length === 0) {
        console.log('City not found')
        return
    }

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=uv_index&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,rain,showers,snowfall,surface_pressure,weather_code&hourly=temperature_2m`)
    const weatherData = await weatherResponse.json()
    createTemperatureChart(weatherData)

    city.textContent = data.results[0].name
    tempDisplay.textContent = `Temperature: ${weatherData.current.temperature_2m} °C`
    description.textContent = weatherDescription(weatherData.current.weather_code)
    wind.textContent = `Wind: ${weatherData.current.wind_speed_10m} m/s ${weatherData.current.wind_direction_10m}°`
    rainfall.textContent = `Rainfall: ${weatherData.current.precipitation} mm`
    pressure.textContent = `Pressure: ${weatherData.current.surface_pressure} hPa`



    const date = new Date()
    forecast.innerHTML = ""
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(date)
        currentDate.setDate(date.getDate() + i)
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
        const day = document.createElement('div')
        day.innerHTML = `
         <p>Max temperature at ${dayName}:   ${weatherData.daily.temperature_2m_max[i]} and lowest temperature:${weatherData.daily.temperature_2m_min[i]}</p><p>

         <h3></h3>
        `
        forecast.appendChild(day)
    }
}

function createTemperatureChart(weatherData) {
    const hours = weatherData.hourly.time.slice(0, 24)
    const temperature = weatherData.hourly.temperature_2m.slice(0, 24)

    const labels = hours.map(hour => hour.slice(11, 16))

    if (temperatureChart) {
        temperatureChart.destroy()
    }

    temperatureChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: temperature
            }]
        }
    })
}

function weatherDescription(code) {
    if (code === 0) {
        return 'Clear sky'
    }
    if (code >= 1 && code <= 3) {
        return 'Scattered clouds'
    }
    if (code >= 51 && code <= 67) {
        return 'Rainy'
    }
}

grid.appendChild(placeInput)
grid.appendChild(searchBtn)
grid.appendChild(city)
grid.appendChild(tempDisplay)
grid.appendChild(chartCanvas)
grid.appendChild(description)
grid.appendChild(wind)
grid.appendChild(rainfall)
grid.appendChild(pressure)
grid.appendChild(forecast)
