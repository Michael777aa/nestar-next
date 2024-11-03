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
	rentViews: number;
	rentLikes: number;
	rentComments: number;
	rentRank: number;
	rentImages: string[];
	rentDesc?: string;
	rentPetsAllowed?: boolean;
	availabilityDate?: Date;
	memberId?: string;
	constructedAt?: Date;
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Properties {
	list: Rent[];
	metaCounter: TotalCounter[];
}
