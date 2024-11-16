import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateUserInfo } from '../auth';
interface MessagePayload {
	id: string;
	event: string;
	text: string;
	memberData: Member;
	createdAt: string;
	isEdited?: boolean;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const chatContainerRef = useRef<HTMLDivElement>(null); // Reference for the chat container
	const [userIsAtBottom, setUserIsAtBottom] = useState(true); // New state

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
				setOpen(false); // Close the chat if the click is outside
			}
		};

		document.addEventListener('mousedown', handleClickOutside); // Listen for outside clicks
		return () => {
			document.removeEventListener('mousedown', handleClickOutside); // Cleanup on unmount
		};
	}, []);

	// 1. Set initial online users from sessionStorage on client side only
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedOnlineUsers = Number(sessionStorage.getItem('onlineUsers')) || 0;
			setOnlineUsers(storedOnlineUsers);
		}
	}, []);

	useEffect(() => {
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);

			switch (data.event) {
				case 'info':
					setOnlineUsers(data.totalClients);
					break;

				case 'getMessages':
					setMessagesList(data.list);
					localStorage.setItem('chatMessages', JSON.stringify(data.list));
					break;

				case 'message':
					// Only add new messages if they’re not duplicates
					setMessagesList((prevMessages) => {
						if (!prevMessages.some((msg) => msg.id === data.id)) {
							const updatedMessages = [...prevMessages, data];
							localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
							return updatedMessages;
						}
						return prevMessages;
					});
					break;

				case 'updateMessage':
					// Update the message text in place without adding to the bottom
					if (data.data && data.data.id) {
						setMessagesList((prevMessages) =>
							prevMessages.map((msg) => (msg.id === data.data.id ? { ...msg, text: data.data.newText } : msg)),
						);
						// Persist the updated messages list in local storage
						localStorage.setItem(
							'chatMessages',
							JSON.stringify(
								messagesList.map((msg) => (msg.id === data.data.id ? { ...msg, text: data.data.newText } : msg)),
							),
						);
					}
					break;

				case 'removeMessage':
					// Ensure the message is only removed if it still exists in the list
					if (data.data && data.data.id) {
						setMessagesList((prevMessages) => prevMessages.filter((msg) => msg.id !== data.data.id));
					}
					break;

				default:
					break;
			}
		};
	}, [socket, messagesList]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	// Scroll to the latest message when the chat opens
	useEffect(() => {
		if (open && chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [open, messagesList]);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [open]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	// Load messages from local storage or request from server if empty
	useEffect(() => {
		if (open) {
			const storedMessages = localStorage.getItem('chatMessages');

			if (storedMessages) {
				// Load messages from local storage if available
				setMessagesList(JSON.parse(storedMessages));
			} else {
				// Fetch messages from server if not in local storage
				socket.send(JSON.stringify({ event: 'getMessages' }));
			}
		}
	}, [open]);

	const handleEditMessage = (id: string, currentText: string) => {
		const newText = prompt('Edit your message:', currentText);
		if (newText && newText !== currentText) {
			const messagePayload = {
				event: 'updateMessage',
				data: { id, newText },
			};
			socket.send(JSON.stringify(messagePayload));

			// Optimistically update the message in place with "isEdited" flag set to true
			setMessagesList((prevMessages) =>
				prevMessages.map((msg) => (msg.id === id ? { ...msg, text: newText, isEdited: true } : msg)),
			);
		}
	};

	const handleRemoveMessage = (id: string) => {
		const confirmDelete = confirm('Are you sure you want to delete this message?');
		if (confirmDelete) {
			// Optimistically update the state to remove the message immediately
			setMessagesList((prevMessages) => prevMessages.filter((msg) => msg.id !== id));

			// Send the delete request to the server
			const messagePayload = {
				event: 'removeMessage',
				data: { id }, // Wrap id in data object
			};
			socket.send(JSON.stringify(messagePayload));
		}
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key === 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) {
			sweetErrorAlert(Messages.error4);
		} else {
			const messagePayload = { event: 'message', data: messageInput };
			socket.send(JSON.stringify(messagePayload));
			setMessageInput('');
		}
	};

	// Scroll to bottom
	const scrollToBottom = () => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTo({
				top: chatContentRef.current.scrollHeight,
				behavior: 'smooth', // Smooth scrolling effect
			});
			setShowScrollButton(false);
		}
	};
	useEffect(() => {
		if (userIsAtBottom) {
			scrollToBottom(); // Scroll only if the user is already at the bottom
		}
	}, [messagesList]);

	const handleScroll = () => {
		if (chatContentRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
			const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50; // 50px threshold

			setUserIsAtBottom(isNearBottom); // Update the userIsAtBottom state
			setShowScrollButton(!isNearBottom); // Show "scroll to bottom" button if not at bottom
		}
	};

	// Function to convert text to link if URL is detected
	const renderMessageText = (text = '') => {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		return (
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
				{text.split(urlRegex).map((part, index) =>
					urlRegex.test(part) ? (
						<Box
							key={index}
							component="a"
							href={part}
							target="_blank"
							rel="noopener noreferrer"
							sx={{ color: '#1DA1F2', textDecoration: 'underline', fontSize: 15, wordBreak: 'break-word' }}
						>
							{part}
						</Box>
					) : (
						<span key={index} style={{ wordBreak: 'break-word', fontSize: 15 }}>
							{part}
						</span>
					),
				)}
			</Box>
		);
	};

	return (
		<>
			{openButton && (
				<button
					onClick={handleOpenChat}
					style={{
						position: 'fixed',
						bottom: '30px',
						right: '30px',
						zIndex: 1100,
						background: '#25D366',
						border: 'none',
						color: 'white',
						borderRadius: '50%',
						width: '60px',
						height: '60px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
						cursor: 'pointer',
						transition: 'background 0.3s ease',
					}}
					onMouseEnter={(e) => (e.currentTarget.style.background = '#1DA855')}
					onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
				>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			)}
			<Stack
				ref={chatContainerRef}
				className={`chat-frame ${open ? 'open' : 'closed'}`}
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '40%',
					height: '100vh',
					backgroundColor: '#E5DDD5',
					boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
					transform: open ? 'translateX(0)' : 'translateX(-100%)',
					transition: 'transform 0.4s ease-in-out',
					zIndex: 1000,
				}}
			>
				<Box
					className="chat-top"
					component="div"
					sx={{
						padding: '20px 25px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						backgroundColor: '#075E54',
						color: 'white',
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					}}
				>
					<div style={{ fontFamily: 'Nunito', fontSize: '22px', fontWeight: 'bold' }}>Chat</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div style={{ fontFamily: 'Nunito', fontSize: '14px', position: 'relative', bottom: 15, left: 5 }}>
							Users Online
						</div>
						<RippleBadge style={{ marginLeft: '20px' }} badgeContent={onlineUsers} />
					</div>
				</Box>
				<Box
					className="chat-content"
					id="chat-content"
					ref={chatContentRef}
					onScroll={handleScroll}
					component="div"
					sx={{
						padding: '15px',
						overflowY: 'auto',
						flexGrow: 1,
						backgroundColor: '#E5DDD5',
					}}
				>
					<ScrollableFeed>
						<Stack className="chat-main" spacing={2}>
							{messagesList.map((ele: MessagePayload) => {
								const { id, text, memberData, createdAt } = ele;
								const memberImage = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';
								const memberName = memberData?.memberNick || 'Guest';

								return (
									<Box
										key={id}
										display="flex"
										flexDirection="column"
										alignItems="flex-start"
										sx={{
											maxWidth: 'auto',
											marginRight: 'auto',
											padding: '10px 15px',
											backgroundColor: memberData?._id === user?._id ? '#DCF8C6' : '#ffffff',
											color: '#303030',
											borderRadius: '10px',
											boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
											overflowWrap: 'break-word',
											wordBreak: 'break-word',
										}}
									>
										<Box display="flex" alignItems="center" mb={1}>
											<Avatar alt={memberName} src={memberImage} sx={{ width: 30, height: 30, marginRight: '8px' }} />
											<Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
												{memberName}
											</Typography>
										</Box>
										<div>{renderMessageText(text)}</div>
										{/* Time, edited label, and edit/remove buttons in a single row */}
										<Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mt={1}>
											{/* Time and edited label */}
											<span
												style={{
													fontSize: '12px',
													color: 'rgba(0, 0, 0, 0.5)',
												}}
											>
												{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
												{ele.isEdited && <span style={{ marginLeft: '5px', fontStyle: 'italic' }}>(edited)</span>}
											</span>

											{/* Edit and delete buttons for the user's own messages */}
											{memberData?._id === user?._id && (
												<Box display="flex" gap={1} style={{ position: 'relative', bottom: '65px', left: '5px' }}>
													<IconButton
														onClick={() => handleEditMessage(id, text)}
														sx={{
															width: '25px',
															height: '25px',
															backgroundColor: '#E0E0E0',
															color: '#4CAF50',
															borderRadius: '50%',
															padding: '4px',
															'&:hover': { backgroundColor: '#C8E6C9' },
														}}
													>
														<EditIcon fontSize="small" />
													</IconButton>

													<IconButton
														onClick={() => handleRemoveMessage(id)}
														sx={{
															width: '25px',
															height: '25px',
															backgroundColor: '#E0E0E0',
															color: '#F44336',
															borderRadius: '50%',
															padding: '4px',
															'&:hover': { backgroundColor: '#FFCDD2' },
														}}
													>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Box>
											)}
										</Box>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>

				{/* Scroll-to-bottom button */}
				{showScrollButton && (
					<IconButton
						onClick={() => {
							scrollToBottom();
							setUserIsAtBottom(true); // Reset the flag to true after scrolling
						}}
						style={{
							position: 'fixed',
							bottom: '85px',
							right: '15px',
							backgroundColor: '#25D366',
							color: 'white',
							zIndex: 1100,
						}}
					>
						<ArrowDownwardIcon />
					</IconButton>
				)}

				<Box
					className="chat-bott"
					component="div"
					sx={{
						display: 'flex',
						alignItems: 'center',
						padding: '15px',
						borderTop: '1px solid #ddd',
						backgroundColor: '#ffffff',
					}}
				>
					<input
						type="text"
						name="message"
						value={messageInput}
						className="msg-input"
						placeholder="Type a message..."
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
						style={{
							flexGrow: 1,
							padding: '12px',
							border: '1px solid #ccc',
							borderRadius: '20px',
							fontSize: '15px',
						}}
					/>
					<button
						className="send-msg-btn"
						onClick={onClickHandler}
						style={{
							backgroundColor: '#25D366',
							border: 'none',
							borderRadius: '50%',
							width: '45px',
							height: '45px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							color: 'white',
							marginLeft: '10px',
							transition: 'background 0.3s ease',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = '#1DA855')}
						onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
					>
						<SendIcon />
					</button>
				</Box>
			</Stack>
		</>
	);
};

export default Chat;
