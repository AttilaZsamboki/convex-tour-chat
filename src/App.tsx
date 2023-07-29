import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { faker } from "@faker-js/faker";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { SendHorizonal } from "lucide-react";
import { Id } from "../convex/_generated/dataModel";

// For demo purposes. In a real app, you'd have real user data.
const NAME = faker.person.firstName();

export default function App() {
	const messages = useQuery(api.messages.list);
	const sendMessage = useMutation(api.messages.send);
	const clearMessages = useMutation(api.messages.clearMessages);
	const likeMessage = useMutation(api.messages.like);

	const [newMessageText, setNewMessageText] = useState("");

	useEffect(() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
	}, [messages?.length]);
	const [isHoveredMessage, setIsHoveredMessage] = useState<{ id: Id<"messages"> | ""; isHovered: boolean }>({
		id: "",
		isHovered: false,
	});

	return (
		<div className='chat'>
			<header className='fixed top-0 left-0 w-full z-[3] flex items-center justify-center flex-col gap-1 bg-primary text-white text-center h-[75px]'>
				<div className='flex flex-col items-center justify-center'>
					<h1 className='font-bold text-md'>Convex Chat</h1>
					<p>
						Connected as <strong>{NAME}</strong>
					</p>
				</div>
				<div className='absolute right-14'>
					<Button variant='destructive' onClick={() => clearMessages()}>
						Clear
					</Button>
				</div>
			</header>
			{messages?.map((message) => (
				<article
					key={message._id}
					className={`my-[24px] mx-auto pl-4 pr-16 box-content ${
						message.author === NAME && ""
					} max-w-[620px] `}>
					<div
						className={`font-semibold text-primary ${
							message.author === NAME ? "text-right" : "text-left"
						}`}>
						{message.author}
					</div>
					<div className={`flex ${message.author === NAME ? "justify-end" : "justify-start"}`}>
						<div
							className='relative'
							onMouseEnter={() => setIsHoveredMessage({ id: message._id, isHovered: true })}
							onMouseLeave={() => setIsHoveredMessage({ id: message._id, isHovered: false })}>
							<p
								className={`${
									message.author === NAME
										? "rounded-br-none text-secondary bg-primary text-right justify-self-end"
										: "rounded-bl-none bg-white text-black justify-self-start"
								} rounded-[16px] p-[20px] my-[0.5em] mx-0 shadow-md overflow-ellipsis leading-[1.4] max-w-lg whitespace-pre-line relative`}>
								{message.body}
								{isHoveredMessage.id === message._id || message.likes.length > 0 ? (
									isHoveredMessage.isHovered || message.likes.length > 0 ? (
										<div
											className='bg-gray-400 p-[1px] px-[3px] rounded-lg max-h-[28px] absolute -bottom-2 -right-2 cursor-pointer'
											onClick={() => likeMessage({ liker: NAME, messageId: message._id })}>
											<span className='text-gray-200 text-md font-semibold'>
												{message.likes.length}
											</span>
											<button>🤍</button>
										</div>
									) : (
										<div></div>
									)
								) : (
									<div></div>
								)}
							</p>
						</div>
					</div>
				</article>
			))}
			<div className='fixed bottom-2 w-full'>
				<form
					className='px-4 h-16'
					onSubmit={async (e) => {
						e.preventDefault();
						await sendMessage({ body: newMessageText, author: NAME });
						setNewMessageText("");
					}}>
					<Input
						value={newMessageText}
						onChange={async (e) => {
							const text = e.target.value;
							setNewMessageText(text);
						}}
						className='h-full bg-transparent text-lg bg-white bg-opacity-80 rounded-xl z-10'
						placeholder='Write a message…'
					/>
					<Button
						className='absolute right-8 bottom-3 cursor-pointer p-2'
						size='icon'
						disabled={!newMessageText}>
						<SendHorizonal className='text-white' />
					</Button>
				</form>
			</div>
		</div>
	);
}
