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
	rentViews?: number; // Optional based on the nullable field in Property type
	rentLikes?: number; // Optional based on the nullable field in Property type
	rentComments?: number; // Optional based on the nullable field in Property type
	rentRank?: number; // Optional based on the nullable field in Property type
	rentImages: string[];
	amenities: string[]; // Added field to match Property type
	includedUtilities: string[]; // Added field to match Property type
	rentDesc?: string;
	rentPetsAllowed?: boolean;
	furnished?: boolean;
	parkingAvailable?: boolean; // Added field to match Property type
	memberId: string; // Changed type to string to match MongoDB ObjectId
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	soldAt?: Date;
}
