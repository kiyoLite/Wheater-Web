//variables
const ImageUnitTemperature = document.getElementById('FarenheitOrCelcius')
const ImageButtonTheme = document.getElementById('DarkOrLight')
const OptionCity = document.getElementById('Ciudad')
const Search = document.getElementById('Search')
const ButtonTheme = document.getElementById('Theme')
const ButtonUnitTemperature = document.getElementById('Unit')
const ResultTemperature = document.getElementById('temperature')
const AverageTemperature = document.getElementById('Result')
const ClimateCondition = document.getElementById('Climate')
const ImageClimate = document.getElementById('Image')
const City: HTMLInputElement | null = document.querySelector('#InputCity')
const Huminity = document.getElementById('UnitHumidity')
const AcronymCountry = document.getElementById('AcronymCountry')
const Wind = document.getElementById('UnitWind')
const KeyApi: String = "d92022246ed99f443ce591581cca2e7d"
let DateJSonObject: null | ObjectJson = null


//hash table

const TypeImageClimate: TypeDataOfImageClimate = {
    'clear sky': 'imagenes/clear.png',
    'few clouds': 'imagenes/cloud.png',
    'scattered clouds': 'imagenes/cloud.png',
    'broken clouds': 'imagenes/cloud.png',
    'shower rain': 'imagenes/drizzle.png',
    'rain': 'imagenes/drizzle.png',
    'thunderstorm': 'imagenes/drizzle.png',
    'snow': 'imagenes/rain.png',
    'mist': 'imagenes/humidity.png',
    'light rain': 'imagenes/drizzle.png',
    'overcast clouds': 'imagenes/cloud.png',
    'moderate rain': 'imagenes/drizzle.png',
    'fog': 'imagenes/cloud.png'
}

//interface
interface TypeDataOfImageClimate {
    [index: string]: string
}
interface PropertyCountryObjectJson {
    country: string
}
interface PropertyWindsObjectJson {
    speed: number
}
interface PropertysMainObjectJson {
    temp_max: number,
    temp_min: number,
    temp: number
    humidity: number,
}


interface PropertysWeatherArrayObjectJson {
    // i try to use as little as possible type data 'any'
    description: any
}

interface ObjectJson {
    main: PropertysMainObjectJson,
    weather: PropertysWeatherArrayObjectJson[]
    wind: PropertyWindsObjectJson
    sys: PropertyCountryObjectJson



}
//function

const HandleCodeErrors: Function = function (ErrorCode: string) {
    throw new TypeError(ErrorCode)
}

const HandleUserErrors: Function = function (ErrorUser: string) {
    City?.classList.add('InputCityError')
    City?.setAttribute('placeholder', ErrorUser)
    setTimeout(() => {
        City?.classList.remove('InputCityError')
        City?.setAttribute('placeholder', 'CIty')
    }, 4000)

}

const CelsiusToFarenheit = function (UnitIncelsius: number) {
    return Math.floor(9 / 5 * UnitIncelsius + 32)
}

const UpdateTemperatureUnit = function (Json: ObjectJson | null) {
    if (Json) {
        if (ImageUnitTemperature && ImageUnitTemperature.getAttribute('src') !== "imagenes/degree-farenheit.svg") {

            ResultTemperature ?
                ResultTemperature.innerHTML = `${CelsiusToFarenheit(Json.main.temp).toString()}` :
                HandleCodeErrors('there is an error in ResultTemperature Varibale');
            AverageTemperature ?
                AverageTemperature.innerHTML = `<strong class="highlight"> Temperature </strong> ${CelsiusToFarenheit(Json.main.temp_max)} - ${CelsiusToFarenheit(Json.main.temp_min)} `
                : HandleCodeErrors('there is an error in Result AVerageTemperature Varibale');
        }
        else if (ImageUnitTemperature && ImageUnitTemperature.getAttribute('src') !== "imagenes/degree-celcius.svg") {
            ResultTemperature ?
                ResultTemperature.innerHTML = `${Math.floor(Json.main.temp)}` :
                HandleCodeErrors('there is an error in ResultTemperature Varibale');
            AverageTemperature ?
                AverageTemperature.innerHTML = `<strong class="highlight"> Temperature </strong> ${Math.floor(Json.main.temp_max)} - ${Math.floor(Json.main.temp_min)} `
                : HandleCodeErrors('there is an error in Result AVerageTemperature Varibale');
        }

        else {
            HandleCodeErrors('there is an error in ImageUnitTemperature')
        }
    }
    else {
        console.log('ejecutando')
        HandleUserErrors(`First look the a city's weather`)
    }

}

const UpdateThemeButton = function () {
    if (ButtonTheme && ImageButtonTheme && ImageButtonTheme.getAttribute('src') === 'imagenes/sun.svg') {
        ImageButtonTheme.setAttribute('src', 'imagenes/moon.svg')
        document.documentElement.removeAttribute('data-theme')
        return
    }
    ImageButtonTheme?.setAttribute('src', 'imagenes/sun.svg')
    document.documentElement.setAttribute('data-theme', 'Light')
    return 'ligth'

}
const UpdateUnitTemparatureButton = function () {
    if (ImageUnitTemperature && ImageUnitTemperature.getAttribute('src') === "imagenes/degree-farenheit.svg") {
        ImageUnitTemperature.setAttribute('src', 'imagenes/degree-celcius.svg')
        return 'Celcius'
    }
    ImageUnitTemperature?.setAttribute('src', 'imagenes/degree-farenheit.svg')
    return 'Fareheit'

}


const UpdateItemsPage = function (ObjectJson: ObjectJson) {

    ClimateCondition
        ? ClimateCondition.textContent = ObjectJson.weather[0].description.toString()
        : HandleCodeErrors('There is an error in the ClimateCondition variable');

    ImageClimate
        ? ImageClimate.setAttribute('src', TypeImageClimate[ObjectJson.weather[0].description.toString()])
        : HandleCodeErrors('There is an error in the ImageWeather variable');

    Wind
        ? Wind.innerHTML = ` <strong class="highlight"> Wind </strong> ${ObjectJson.wind.speed.toString()} m/s`
        : HandleCodeErrors('There is an error in the Wind Variable');

    AcronymCountry
        ? AcronymCountry.innerHTML = `<strong class="highlight"> Country </strong>${ObjectJson.sys.country}`
        : HandleCodeErrors('There is an error in the AcronymCountry Variable');

    Huminity
        ? Huminity.innerHTML = `<strong class="highlight"> Huminity </strong> ${ObjectJson.main.humidity.toString()} % `
        : HandleCodeErrors('There is an error in the Huminity Variable');

    UpdateTemperatureUnit(ObjectJson)
}


ButtonTheme?.addEventListener('click', UpdateThemeButton)

ButtonUnitTemperature?.addEventListener('click', UpdateUnitTemparatureButton)

ButtonUnitTemperature?.addEventListener('click', () => {
    UpdateTemperatureUnit(DateJSonObject)
})

Search?.addEventListener('submit', e => {
    e.preventDefault()
    if (City?.value === "") {
        HandleUserErrors('City is empty ')
    }
    let Url: string = `https://api.openweathermap.org/data/2.5/weather?q=${City?.value}&appid=${KeyApi}&units=metric`

    fetch(Url)
        .then(Date => {
            if (!Date.ok) {
                return Date.json()
                    .then(Error => { throw new Error(Error.message) })
            }
            return Date.json()
        })
        .then(DateJson => {
            DateJSonObject = DateJson
            console.log(DateJson)
            UpdateItemsPage(DateJson)

        })
})


