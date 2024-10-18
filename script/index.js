const ById = (id, value) => {
    document.getElementById(id).innerHTML = value;
};

const enter = (event) => {
    if (event.key === 'Enter') {
        get_weather();
    }
};

const get_weather = () => {
    const input_value = document.getElementById('input').value;
    const flags = document.getElementById('country-flag');
    const icon = document.getElementById('temp_icon');
    const API_KEY = "fd48bdf8a8b87b3c140f17625f4e2d57";
    const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

    if (input_value) {
        fetch(`${API_URL}${input_value}&appid=${API_KEY}&units=metric`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then((data) => {
                const state = {
                    temperature: data.main.temp,
                    city: data.name,
                    country: data.sys.country,
                    icon: data.weather[0].icon
                };

                ById('temp', `${state.temperature} °C`);
                ById('city', state.city);
                ById('country', state.country);
                flags.src = `https://flagpedia.net/data/flags/h80/${state.country.toLowerCase()}.png`;
                icon.src = `https://openweathermap.org/img/w/${state.icon}.png`;
                ById('errorMessage', '');
                document.getElementById('input').value = '';
            })
            .catch((err) => {
                ById('errorMessage', 'Error: ' + err.message);
            });
    } else {
        ById('errorMessage', 'Please enter a city name.');
    }
};

const get_weather_by_geolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const API_KEY = "fd48bdf8a8b87b3c140f17625f4e2d57";
            const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            fetch(API_URL)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Weather data not found');
                    }
                    return response.json();
                })
                .then((data) => {
                    const state = {
                        temperature: data.main.temp,
                        city: data.name,
                        country: data.sys.country,
                        icon: data.weather[0].icon
                    };

                    ById('temp', `${state.temperature} °C`);
                    ById('city', state.city);
                    ById('country', state.country);
                    document.getElementById('country-flag').src = `https://flagpedia.net/data/flags/h80/${state.country.toLowerCase()}.png`;
                    document.getElementById('temp_icon').src = `https://openweathermap.org/img/w/${state.icon}.png`;
                    ById('errorMessage', '');
                })
                .catch((err) => {
                    ById('errorMessage', 'Error: ' + err.message);
                });
        }, (error) => {
            ById('errorMessage', 'Geolocation error: ' + error.message);
        });
    } else {
        ById('errorMessage', 'Geolocation is not supported by this browser.');
    }
};

get_weather_by_geolocation();
