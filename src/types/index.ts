// 1. ModuleId
// 2. ValueType
export enum ValueType {
  Scalar = 'Scalar',
  Vector = 'Vector',
  Grid = 'Grid',
}

// 3. Parameter
export enum ParameterType {
  Instantaneous = 'Instantaneous',
  Accumulative = 'Accumulative',
  Mean = 'Mean',
}

export type Parameter = {
  parameterId: string,
  variable: string,
  unit: string,
  parameterType: ParameterType,
}

// 4. Location
export type Location = {
  locationId: string,
  name: string,
  lat: number,
  lon: number,
  elevation?: number,
  description?: string,
}

// 5. TimeSeriesType
export enum TimeSeriesType {
  ExternalHistorical = 'ExternalHistorical',
  ExternalForecasting = 'ExternalForecasting',
  SimulatedHistorical = 'SimulatedHistorical',
  SimulatedForecasting = 'SimulatedForecasting',
}

// 6. TimeStep
export enum TimeStepUnit {
  Second = 'Second',
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
  NonEquidistant = 'NonEquidistant',
}
export type TimeStep = {
  timeStepId: string,
  unit: TimeStepUnit,
  multiplier?: number,
  divider?: number,
}

// Metadata
export type Metadata = {
  moduleId: string,
  valueType: ValueType,
  parameter: Parameter,
  location: Location,
  timeSeriesType: TimeSeriesType,
  timeStep: TimeStep,
}
export type MetadataIds = {
  moduleId: string,
  valueType: ValueType,
  parameterId: string,
  locationId: string,
  timeSeriesType: TimeSeriesType,
  timeStepId: string,
}

// DataPoint
export type DataPoint = {
  time: string | number,
  value: number,
}

// TimeSeries
export type TimeSeries = {
  timeSeriesId: string,
  metadataIds: MetadataIds,
  data: DataPoint[],
}
