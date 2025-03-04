
export type WeatherData = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export type ForecastData = {
  list: {
    dt_txt: string;
    main: {
       temp: number;
       humidity:  number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
};