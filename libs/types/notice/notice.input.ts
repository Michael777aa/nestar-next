import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	_id: string;
	memberId?: string;
}

interface BAISearch {
	articleCategory: NoticeCategory;
	text?: string;
}
export interface Noticies2Inquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: BAISearch;
}
interface NoticeSearch {
	noticeStatus?: NoticeStatus;
	text?: string;
	noticeCategory?: NoticeCategory;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NoticeSearch;
}
