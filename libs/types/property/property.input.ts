import { Direction } from '../../enums/common.enum';
import { AvailabilityStatus, RentLocation, RentType } from '../../enums/property.enum';

export interface RentInput {
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

interface PISearch {
	memberId?: string;
	locationList?: RentLocation[];
	typeList?: RentType[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	squaresRange?: Range;
	balconiesList?: Number[];
	text?: string;
}

export interface RentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	availabilityStatus?: AvailabilityStatus;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	availabilityStatus?: AvailabilityStatus;
	rentLocationList?: RentLocation[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
