import { AvailabilityStatus, RentLocation, RentType } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Rent {
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
	parkingAvailable?: boolean; // Added field to match Property type
	memberId: string; // Changed type to string to match MongoDB ObjectId
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	soldAt?: Date;
	updatedAt: Date;
	memberData?: Member; // Added optional field to match Property type
	meLiked?: MeLiked[]; // Added optional field to match Property type
}

export interface Properties {
	list: Rent[];
	metaCounter: TotalCounter[];
}
