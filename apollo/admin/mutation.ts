import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberEmail
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFirstName
			memberLastName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberArticles
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberComments
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_RENT_BY_ADMIN = gql`
	mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
		updatePropertyByAdmin(input: $input) {
			_id
			rentType
			availabilityStatus
			rentLocation
			rentAddress
			rentTitle
			rentalPrice
			rentSquare
			rentBalconies
			rentViews
			rentLikes
			rentComments
			rentRank
			rentImages
			amenities
			includedUtilities
			rentDesc
			rentPetsAllowed
			parkingAvailable
			furnished
			memberId
			deletedAt
			constructedAt
			createdAt
			soldAt
			updatedAt
			memberData {
				_id
				memberType
				memberEmail
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFirstName
				memberLastName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const REMOVE_PROPERTY_BY_ADMIN = gql`
	mutation RemovePropertyByAdmin($input: String!) {
		removePropertyByAdmin(propertyId: $input) {
			_id
			rentType
			availabilityStatus
			rentLocation
			rentAddress
			rentTitle
			rentalPrice
			rentSquare
			rentBalconies
			rentViews
			rentLikes
			rentComments
			rentRank
			rentImages
			amenities
			includedUtilities
			rentDesc
			rentPetsAllowed
			parkingAvailable
			furnished
			memberId
			deletedAt
			constructedAt
			createdAt
			soldAt
			updatedAt
			memberData {
				_id
				memberType
				memberEmail
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFirstName
				memberLastName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_NOTICE = gql`
	mutation UpdateNotice($input: NoticeUpdate!) {
		updateNotice(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			createdAt
			updatedAt
		}
	}
`;
