import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

interface MessagePayload {
	id: string;
	event: string;
	text: string;
	memberData: Member;
	createdAt: string;
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
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	// Load messages from local storage on component mount
	useEffect(() => {
		const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
		setMessagesList(storedMessages);

		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					localStorage.setItem('chatMessages', JSON.stringify(list));
					break;
				case 'message':
					const newMessage: MessagePayload = data;
					setMessagesList((prevMessages) => {
						const updatedMessages = [...prevMessages, newMessage];
						localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
						return updatedMessages;
					});
					break;
			}
		};
	}, [socket]);

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

	// Disable page scroll when chat is open
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
						background: '#4A90E2',
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
					onMouseEnter={(e) => (e.currentTarget.style.background = '#357ABD')}
					onMouseLeave={(e) => (e.currentTarget.style.background = '#4A90E2')}
				>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			)}
			<Stack
				className={`chat-frame ${open ? 'open' : 'closed'}`}
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '40%',
					height: '100vh',
					backgroundColor: '#ffffff',
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
						padding: '15px 20px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						backgroundColor: '#4A90E2',
						color: 'white',
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					}}
				>
					<div style={{ fontFamily: 'Nunito', fontSize: '20px', fontWeight: 'bold' }}>Online Chat</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div style={{ fontFamily: 'Nunito', fontSize: '14px' }}>Users Online</div>
						<RippleBadge style={{ marginLeft: '20px' }} badgeContent={onlineUsers} />
					</div>
				</Box>
				<Box
					className="chat-content"
					id="chat-content"
					ref={chatContentRef}
					component="div"
					sx={{
						padding: '15px',
						overflowY: 'auto',
						flexGrow: 1,
						backgroundColor: '#f9f9f9',
					}}
				>
					<ScrollableFeed>
						<Stack className="chat-main" spacing={2}>
							<Box
								sx={{
									fontWeight: 700,
									fontSize: '24px',
									color: '#4A90E2',
									marginBottom: '10px',
								}}
							>
								Welcome to Live Chat!
							</Box>
							{messagesList.map((ele: MessagePayload) => {
								const { id, text, memberData, createdAt } = ele;
								const memberImage = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';

								return memberData?._id === user?._id ? (
									// Message on the right side for the authenticated user
									<Box
										key={id}
										component="div"
										flexDirection="row"
										display="flex"
										alignItems="center"
										justifyContent="flex-end"
										sx={{
											backgroundColor: '#4A90E2',
											color: 'white',
											padding: '10px 15px',
											borderRadius: '15px',
											maxWidth: '70%',
											marginLeft: 'auto',
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
										}}
									>
										<div>{text}</div>
										<span
											style={{
												fontSize: '12px',
												marginLeft: '10px',
												color: 'rgba(255, 255, 255, 0.7)',
												cursor: 'pointer',
											}}
										>
											{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</span>
									</Box>
								) : (
									// Message on the left side for other users
									<Box
										key={id}
										flexDirection="row"
										display="flex"
										alignItems="center"
										sx={{
											backgroundColor: '#e0e0e0',
											color: '#333',
											padding: '10px 15px',
											borderRadius: '15px',
											maxWidth: '70%',
											marginRight: 'auto',
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
										}}
									>
										<Avatar alt={memberData?.memberNick || 'User'} src={memberImage} sx={{ marginRight: '10px' }} />
										<div>{text}</div>
										<span
											style={{
												fontSize: '12px',
												marginLeft: '10px',
												color: 'rgba(0, 0, 0, 0.6)',
												cursor: 'pointer',
											}}
										>
											{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</span>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box
					className="chat-bott"
					component="div"
					sx={{
						display: 'flex',
						alignItems: 'center',
						padding: '10px',
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
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '20px',
							fontSize: '14px',
						}}
					/>
					<button
						className="send-msg-btn"
						onClick={onClickHandler}
						style={{
							backgroundColor: '#4A90E2',
							border: 'none',
							borderRadius: '50%',
							width: '40px',
							height: '40px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							color: 'white',
							marginLeft: '10px',
							transition: 'background 0.3s ease',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = '#357ABD')}
						onMouseLeave={(e) => (e.currentTarget.style.background = '#4A90E2')}
					>
						<SendIcon />
					</button>
				</Box>
			</Stack>
		</>
	);
};

export default Chat;
