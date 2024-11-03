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
