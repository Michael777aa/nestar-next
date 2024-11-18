import { RentLocation, AvailabilityStatus, RentType } from '../../enums/property.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { MemberType } from '../../enums/member.enum';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	targetAudience: MemberType;
	noticeTitle: string;
	noticeContent: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TotalCounter {
	field: string;
	count: number;
}

export interface Notices {
	list: Notice[];
	metaCounter?: TotalCounter[];
}
