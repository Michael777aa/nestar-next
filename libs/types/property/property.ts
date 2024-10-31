import { AvailabilityStatus, RentLocation, rentType } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Property {
	_id: string;
	rentType: rentType;
	availabilityStatus: AvailabilityStatus;
	rentLocation: RentLocation;
	rentAddress: string;
	rentTitle: string;
	rentalPrice: number;
	rentSquare: number;
	rentBalconies: number;
	rentViews: number;
	rentLikes: number;
	rentComments: number;
	rentRank: number;
	rentImages: string[];
	rentDesc?: string;
	rentPetsAllowed?: boolean;
	propertyBarter?: boolean;
	propertyRent?: boolean;
	availabilityDate?: Date;
	memberId?: string;
	constructedAt?: Date;

	// jojjoi
}

export interface Properties {
	list: Property[];
	metaCounter: TotalCounter[];
}
