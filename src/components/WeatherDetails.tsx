import React, { ReactNode } from 'react'
import { FiDroplet } from 'react-icons/fi'
import { ImMeter } from 'react-icons/im'
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu'
import { MdAir } from 'react-icons/md'

export type WeatherDetailsPropsType = {
	visibility: string,
	humidity: string,
	windSpeed: string,
	airPressure: string,
	sunrise: string,
	sunset: string
}

export default function WeatherDetails(props: WeatherDetailsPropsType) {
	
	const {
		visibility = "N/A",
		humidity = "N/A",
		windSpeed = "N/A",
		airPressure = "N/A",
		sunrise = "N/A",
		sunset = "N/A",
	} = props

	return (
		<>
			<WeatherDetail
				information="Visibility"
				icon={<LuEye />}
				value={visibility}
			/>
			<WeatherDetail
				information="Humidity"
				icon={<FiDroplet />}
				value={humidity}
			/>
			<WeatherDetail
				information="Wind Speed"
				icon={<MdAir />}
				value={windSpeed}
			/>
			<WeatherDetail
				information="Air Pressure"
				icon={<ImMeter />}
				value={airPressure}
			/>
			<WeatherDetail
				information="Sunrise"
				icon={<LuSunrise />}
				value={sunrise}
			/>
			<WeatherDetail
				information="Sunset"
				icon={<LuSunset />}
				value={sunset}
			/>
		</>
	)
}

type WeatherDetailPropsType = {
	information: string,
	icon: ReactNode,
	value: string
}

function WeatherDetail(props: WeatherDetailPropsType) {
	return (
		<div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
			<p className="whitespace-nowrap">
				{props.information}
			</p>
			<div className="text-3xl">{props.icon}</div>
			<p>{props.value}</p>
		</div>
	)
}