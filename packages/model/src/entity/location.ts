import { type Place } from '@activity-kit/types';

export interface LocationProps {
  name: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  accuracy?: number;
}

export class Location {
  public readonly name: string;
  public readonly latitude?: number;
  public readonly longitude?: number;
  public readonly altitude?: number;
  public readonly accuracy?: number;

  constructor(props: Readonly<LocationProps>) {
    this.name = props.name;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.altitude = props.altitude;
    this.accuracy = props.accuracy;
  }

  public toAP(): Place {
    return {
      type: 'Place',
      name: this.name,
      latitude: this.latitude,
      longitude: this.longitude,
      altitude: this.altitude,
      accuracy: this.accuracy,
    };
  }
}
