import ChatInstance from '../components/ChatInstance.tsx';

interface ChatWrapperProps {
    ownUserId: string;
    otherUserId: string;
}

const ChatWrapper:React.FC<ChatWrapperProps> = ({ownUserId, otherUserId}) => {
    return <div>
        <ChatInstance ownUserId={ownUserId} otherUserId={otherUserId}/>
    </div>
}

export default ChatWrapper;