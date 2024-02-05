'use client'

import Container from '@/components/Container';
import Forecast from '@/components/Forecast';
import Navbar from '@/components/Navbar';
import { WeatherData } from '@/components/SearchBox';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherIcon from '@/components/WeatherIcon';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius';
import { convertMetersToKilometers } from '@/utils/convertMetersToKilometers';
import axios from 'axios';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import Image from "next/image";
import { useQuery } from 'react-query';
import { loadingCityAtom, placeAtom } from './atom';
import { useEffect } from 'react';

export default function Home() {
	const [place, setPlace] = useAtom(placeAtom);
	const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

	const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async () => {
		const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
		return data;
	});

	useEffect(() => {
		refetch()	
	}, [place, refetch]);

	if (isLoading || loadingCity) return (
		<div className="flex items-center min-h-screen justify-center">
			<p className="animate-bounce">Loading...</p>
		</div>
	)

	const firstData = data?.list[0];

	const currentVisibilityInKilometers = convertMetersToKilometers(firstData?.visibility ?? 0);
	const currentHumidity = firstData?.main.humidity ?? 0;
	const currentWindSpeed = firstData?.wind.speed ? Math.round(firstData?.wind.speed) : 0;
	const currentAirPressure = firstData?.main.pressure ?? 0;
	const currentSunrise = data?.city.sunrise ? format(fromUnixTime(data.city.sunrise), 'HH:mm') : 'N/A';
	const currentSunset = data?.city.sunset ? format(fromUnixTime(data.city.sunset), 'HH:mm') : 'N/A';

	const uniqueDates = [
		...new Set(
			data?.list.map(
				(entry) => entry.dt_txt.split(' ')[0]
			)
		)
	];

	return (
		<div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
			<Navbar location={data?.city.name ?? ''} />
			<main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
				<section className="space-y-4">
					<div className="space-y-2">
						<h2 className="flex gap-1 text-2xl items-end">
							<p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
							<p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})</p>
						</h2>
						<Container className="gap-10 px-6 items-center">
							<div className="flex flex-col px-4">
								<span className="text-5xl">
									{convertKelvinToCelsius(firstData?.main.temp ?? 0)}&nbsp;°
								</span>
								<p className="text-xs space-x-1 whitespace-nowrap">
									<span>Feels like {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
								</p>
								<p className="text-xs space-x-2">
									<span>&#8595;{convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}&nbsp;°</span>
									<span>&#8593;{convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}&nbsp;°</span>
								</p>
							</div>
							<div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
								{data?.list.map((dataElement, index) => (
									<div
										key={index}
										className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
											<p className="whitespace-nowrap">
												{format(parseISO(dataElement.dt_txt), "HH:mm")}
											</p>
											<WeatherIcon iconName={dataElement?.weather[0].icon ?? ''}/>
											<p>
												{
													convertKelvinToCelsius(dataElement?.main.temp ?? 0)
												}
											</p>
									</div>
								))}

							</div>
						</Container>
					</div>
					<div className="flex gap-4">
						<Container className="w-fit justify-center flex-col px-4 items-center">
							<p className="capitalize text-center">{firstData?.weather[0].description}</p>
							<WeatherIcon iconName={firstData?.weather[0].icon ?? ''}/>
						</Container>
						<Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
							<WeatherDetails
								visibility={0 === currentVisibilityInKilometers ? 'N/A' : currentVisibilityInKilometers + ' km'}
								humidity={0 === currentHumidity ? 'N/A' : currentHumidity + ' %'}
								windSpeed={0 === currentWindSpeed ? 'N/A' : currentWindSpeed + ' m/s'}
								airPressure={0 === currentAirPressure ? 'N/A' : currentAirPressure + ' hPa'}
								sunrise={currentSunrise}
								sunset={currentSunset}
							/>
						</Container>
					</div>
				</section>
				<section className="flex w-full flex-col gap-4">
					<p className="">Forecast (7 days)</p>
					{
						uniqueDates.map(
							(date, index) => {
								const futureDateData = data?.list.filter((dataElement) => dataElement.dt_txt === date + ' 15:00:00');

								if (futureDateData && futureDateData.length > 0) {
									const futureVisibilityInKilometers = convertMetersToKilometers(futureDateData[0]?.visibility ?? 0);
									const futureHumidity = futureDateData[0]?.main.humidity ?? 0;
									const futureWindSpeed = futureDateData[0]?.wind.speed ? Math.round(futureDateData[0]?.wind.speed) : 0;
									const futureAirPressure = futureDateData[0]?.main.pressure ?? 0;
									const futureSunrise = data?.city.sunrise ? format(fromUnixTime(data.city.sunrise), 'HH:mm') : 'N/A';
									const futureSunset = data?.city.sunset ? format(fromUnixTime(data.city.sunset), 'HH:mm') : 'N/A';
									
									return <Forecast
										key={index}
										description={futureDateData[0].weather[0].description}
										weatherIcon={futureDateData[0].weather[0].icon ?? '01d'}
										date={'' !== futureDateData[0].dt_txt ? format(parseISO(futureDateData[0].dt_txt), 'dd.MM') : 'N/A'}
										day={'' !== futureDateData[0].dt_txt ? format(parseISO(futureDateData[0].dt_txt), 'EEEE') : 'N/A'}
										feels_like={futureDateData[0].main.feels_like ?? 0}
										temp={futureDateData[0].main.temp ?? 0}
										temp_max={futureDateData[0].main.temp_max ?? 0}
										temp_min={futureDateData[0].main.temp_min ?? 0}
										visibility={0 === futureVisibilityInKilometers ? 'N/A' : futureVisibilityInKilometers + ' km'}
										humidity={0 === futureHumidity ? 'N/A' : futureHumidity + ' %'}
										windSpeed={0 === futureWindSpeed ? 'N/A' : futureWindSpeed + ' m/s'}
										airPressure={0 === futureAirPressure ? 'N/A' : futureAirPressure + ' hPa'}
										sunrise={futureSunrise}
										sunset={futureSunset}
									/>
								}

							}
						)
					}
				</section>
			</main>
		</div>
	);
}
