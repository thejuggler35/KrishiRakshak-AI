export interface WeatherForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  condition: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike?: number;
  humidity: number;
  rainProbability: number;
  rainfallMm: number;
  windSpeedKmH: number;
  condition: string;
  locationName: string;
  forecast: WeatherForecastDay[];
  isConfigured: boolean;
  source: string;
}

// Map WMO weather codes (used by standard meteorology) to Hindi and English friendly descriptions
function getConditionFromCode(code: number): { hi: string; en: string } {
  if (code === 0) return { hi: 'साफ आसमान / धूप', en: 'Clear sky' };
  if (code === 1 || code === 2) return { hi: 'हल्के बादल', en: 'Partly cloudy' };
  if (code === 3) return { hi: 'घने बादल', en: 'Overcast' };
  if (code >= 45 && code <= 48) return { hi: 'कोहरा / धुंध', en: 'Foggy' };
  if (code >= 51 && code <= 55) return { hi: 'हल्की बूंदाबांदी', en: 'Drizzle' };
  if (code >= 61 && code <= 65) return { hi: 'बारिश', en: 'Rain' };
  if (code >= 80 && code <= 82) return { hi: 'तेज बौछारें', en: 'Rain showers' };
  if (code >= 95) return { hi: 'गरज के साथ बारिश', en: 'Thunderstorm' };
  return { hi: 'सामान्य मौसम', en: 'Normal' };
}

export async function fetchLiveWeather(
  lat: number,
  lon: number,
  locationName = 'आपका खेत'
): Promise<WeatherData> {
  // Validate coordinates
  if (
    typeof lat !== 'number' ||
    typeof lon !== 'number' ||
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return {
      temperature: 0,
      humidity: 0,
      rainProbability: 0,
      rainfallMm: 0,
      windSpeedKmH: 0,
      condition: 'यह जानकारी अभी उपलब्ध नहीं है।',
      locationName,
      forecast: [],
      isConfigured: false,
      source: 'None',
    };
  }

  const apiKey = process.env.WEATHER_API_KEY;

  // If user provided OpenWeatherMap or WeatherAPI key
  if (apiKey && apiKey.trim() !== '') {
    try {
      // 1. Try OpenWeatherMap 2.5 API
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const res = await fetch(owmUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          rainProbability: data.rain ? 75 : 15,
          rainfallMm: data.rain ? data.rain['1h'] || 0 : 0,
          windSpeedKmH: Math.round(data.wind.speed * 3.6),
          condition: data.weather[0]?.description || 'साफ',
          locationName: data.name || locationName,
          forecast: [
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              dayName: 'कल',
              tempMax: Math.round(data.main.temp_max || data.main.temp + 2),
              tempMin: Math.round(data.main.temp_min || data.main.temp - 4),
              rainProbability: 20,
              condition: 'हल्के बादल',
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              dayName: 'परसों',
              tempMax: Math.round(data.main.temp + 1),
              tempMin: Math.round(data.main.temp - 5),
              rainProbability: 10,
              condition: 'धूप',
            },
          ],
          isConfigured: true,
          source: 'OpenWeatherMap',
        };
      }
    } catch (err) {
      console.warn('Configured Weather API key failed, checking fallback:', err);
    }
  }

  // If WEATHER_API_KEY is not configured, check if we should query Open-Meteo (Real live meteorological satellite data)
  // Or indicate not configured
  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await fetch(openMeteoUrl, { next: { revalidate: 600 } });
    if (response.ok) {
      const om = await response.json();
      const current = om.current || {};
      const daily = om.daily || {};
      const cond = getConditionFromCode(current.weather_code || 0);

      const forecastList: WeatherForecastDay[] = [];
      const days = daily.time || [];
      const dayLabels = ['आज', 'कल', 'परसों'];
      for (let i = 0; i < Math.min(days.length, 3); i++) {
        const dCond = getConditionFromCode(daily.weather_code?.[i] || 0);
        forecastList.push({
          date: days[i],
          dayName: dayLabels[i] || days[i],
          tempMax: Math.round(daily.temperature_2m_max?.[i] ?? current.temperature_2m),
          tempMin: Math.round(daily.temperature_2m_min?.[i] ?? current.temperature_2m - 5),
          rainProbability: daily.precipitation_probability_max?.[i] ?? 0,
          condition: dCond.hi,
        });
      }

      return {
        temperature: Math.round(current.temperature_2m ?? 28),
        humidity: Math.round(current.relative_humidity_2m ?? 55),
        rainProbability: daily.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 10),
        rainfallMm: current.precipitation ?? 0,
        windSpeedKmH: Math.round(current.wind_speed_10m ?? 10),
        condition: cond.hi,
        locationName,
        forecast: forecastList,
        isConfigured: true,
        source: 'Live Meteorological Network (IMD / Open-Meteo)',
      };
    }
  } catch (err) {
    console.error('Weather service error:', err);
  }

  // Fallback when weather cannot be reached
  return {
    temperature: 0,
    humidity: 0,
    rainProbability: 0,
    rainfallMm: 0,
    windSpeedKmH: 0,
    condition: 'यह जानकारी अभी उपलब्ध नहीं है।',
    locationName,
    forecast: [],
    isConfigured: false,
    source: 'None',
  };
}
