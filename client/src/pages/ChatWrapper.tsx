import ChatInstance from '../components/ChatInstance.tsx';

interface ChatWrapperProps {
    ownUserId: string;
    otherUserId: string;
}

// interface Instance {

// }

const ChatWrapper:React.FC<ChatWrapperProps> = ({ownUserId, otherUserId}) => {
    // const [allInstances, setAllInstances] = useState(null);

    return <div>
        <ChatInstance ownUserId={ownUserId} otherUserId={otherUserId}/>
    </div>
}

export default ChatWrapper;