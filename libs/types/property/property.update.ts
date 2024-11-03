import { AvailabilityStatus, RentLocation, RentType } from '../../enums/property.enum';

export interface RentUpdate {
	_id: string;
	rentType: RentType;
	availabilityStatus: AvailabilityStatus;
	rentLocation: RentLocation;
	rentAddress: string;
	rentTitle: string;
	rentalPrice: number;
	rentSquare: number;
	rentBalconies: number;
	rentViews?: number;
	rentLikes?: number;
	rentComments?: number;
	rentRank?: number;
	rentImages: string[];
	amenities: string[];
	includedUtilities: string[];
	rentDesc?: string;
	rentPetsAllowed?: boolean;
	furnished?: boolean;
	parkingAvailable?: boolean;
	memberId: string;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	soldAt?: Date;
}
