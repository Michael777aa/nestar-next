import { AvailabilityStatus, RentLocation, rentType } from '../../enums/property.enum';

export interface PropertyUpdate {
	rentType: rentType;
	availabilityStatus: AvailabilityStatus;
	rentLocation: RentLocation;
	rentAddress: string;
	rentTitle: string;
	rentalPrice: number;
	rentSquare: number;
	rentBalconies: number;
	rentImages: string[];
	rentDesc?: string;
	rentPetsAllowed?: boolean;
	propertyBarter?: boolean;
	propertyRent?: boolean;
	availabilityDate?: Date;
	memberId?: string;
	constructedAt?: Date;
}
