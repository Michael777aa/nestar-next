import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
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
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
}

`);

/**************************
 *        PROPERTY        *
 *************************/

export const GET_RENT = gql`
	query GetProperty($input: String!) {
		getProperty(propertyId: $input) {
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

export const GET_PROPERTIES = gql`
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
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
				memberId
				deletedAt
				constructedAt
				createdAt
				soldAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PROPERTIES = gql`
	query GetAgentProperties($input: AgentPropertiesInquiry!) {
		getAgentProperties(input: $input) {
			list {
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
				memberId
				deletedAt
				constructedAt
				createdAt
				soldAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
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
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
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

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
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
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
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
				followerData {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_NOTIFICATIONS = gql`
	query GetNotifications($input: NotificationInquiry!) {
		getNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				propertyId
				articleId
				createdAt
				updatedAt
			}
		}
	}
`;
