import { cn } from '@/utils/cn'
import React, { ChangeEventHandler, FormEventHandler } from 'react'
import { IoSearch } from 'react-icons/io5'

type Props = {
	className?: string,
	value: string,
	onChange: ChangeEventHandler<HTMLInputElement>
	onSubmit: FormEventHandler<HTMLFormElement>
}

export type WeatherData = {
	cod: string;
	message: number;
	cnt: number;
	list: WeatherItem[];
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
};

type WeatherItem = {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	visibility: number;
	pop: number;
	snow: {
		"3h": number;
	};
	sys: {
		pod: string;
	};
	dt_txt: string;
};

export default function SearchBox(props: Props) {
	return (
		<form
			className={cn("flex relative items-center justify-center h-10", props.className)}
			onSubmit={props.onSubmit}
		>
			<input
				type="text"
				value={props.value}
				onChange={props.onChange}
				placeholder="Search location..."
				className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full" />
			<button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600 h-full">
				<IoSearch />
			</button>
		</form>
	)
}