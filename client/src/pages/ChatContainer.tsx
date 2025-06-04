import React, {useEffect, useState} from 'react';
import ChatInstance from '../components/ChatInstance.tsx';
import { supabase } from '../lib/supabase.ts';
// import { supabase } from '../lib/supabase.ts';

interface ChatContainerProps {
    ownUserId: string;
    otherUserId: string;
}

interface PreviewInterface {
    room_name: string;
    other_mem_id: string | "";
    other_mem_name: string | "";
    created_at: any;
}

const ChatContainer:React.FC<ChatContainerProps> = ({ownUserId, otherUserId}) => {
    const [selectedChat, setSelectedChat] = useState<number>(-1);
    // const [clickedProfile, setClickedProfile] = useState(false);
    const [previews, setPreviews] = useState<PreviewInterface[]>([]);

    useEffect(() => {
        setSelectedChat(-1);
        console.log("changed selectedChat");
    }, [otherUserId]);

    // const fetchAll = async () => {
    //     let {data, error} = await supabase
    //         .from('rooms')
    //         .select('*')
    //         .eq('member_id', ownUserId);
    //     if (error) {
    //         console.log("error grabbing convo list in chatcontainer:", error);
    //     }
    //     // console.log("fetchconvos return:", data);
    //     const formattedPreviews: PreviewInterface[] = data?.map(item => ({
    //         room_name: item.room_name,
    //         other_mem_id: "",
    //         other_mem_name: "",
    //         created_at: item.created_at
    //     })) || [];

    //     // console.log("fetchconvos previews:", formattedPreviews);

    //     // // setPreviews(prevPreviews => [...prevPreviews, ...formattedPreviews]);
    //     // setPreviews(formattedPreviews);

    //     // const updatedPreviews = [...previews];
    //     for (let i=0; i<formattedPreviews.length; i++) {

    //         const pre = formattedPreviews[i];
    //         console.log("fetchothermember roomname:", pre.room_name); 
            
    //         var {data: other_mem_id, error: error_id} = await supabase
    //             .from('rooms')
    //             .select('member_id')
    //             .eq('room_name', pre.room_name)
    //             .neq('member_id', ownUserId)
    //             .maybeSingle();
    //         if (error_id || !other_mem_id?.member_id) {
    //             console.log("error finding other member id - chatcontainer:", error_id);
    //             console.log("other_mem exists?:", other_mem_id?.member_id);
    //             continue;
    //         }
    //         const {data: other_mem_name, error: error_name} = await supabase
    //             .from('profiles')
    //             .select('full_name')
    //             .eq('id', other_mem_id?.member_id)
    //             .maybeSingle();
    //         if(error_name) {
    //             console.log("error finding other member name:", error_name);
    //         }
    //         formattedPreviews[i] = {
    //             ...pre,
    //             other_mem_id: other_mem_id?.member_id || "",
    //             other_mem_name: other_mem_name?.full_name || ""
    //         }
    //     }
    //     console.log("fetchother preview:", formattedPreviews);

    //     setPreviews(formattedPreviews);
    // }

    // useEffect(()=> {
    //     fetchAll();
    // }, [ownUserId, otherUserId]);

useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
        let { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('member_id', ownUserId);

        if (error) {
            console.log("error grabbing convo list in chatcontainer:", error);
            return;
        }

        const formattedPreviews: PreviewInterface[] = data?.map(item => ({
            room_name: item.room_name,
            other_mem_id: "",
            other_mem_name: "",
            created_at: item.created_at
        })) || [];

        for (let i = 0; i < formattedPreviews.length; i++) {
            const pre = formattedPreviews[i];

            const { data: other_mem_id, error: error_id } = await supabase
                .from('rooms')
                .select('member_id')
                .eq('room_name', pre.room_name)
                .neq('member_id', ownUserId)
                .maybeSingle();
            if (error_id || !other_mem_id?.member_id) {
                console.log("error finding other member id - chatcontainer:", error_id);
                continue;
            }

            const { data: other_mem_name, error: error_name } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', other_mem_id.member_id)
                .maybeSingle();

            if (!isMounted) return; // exit early if unmounted

            formattedPreviews[i] = {
                ...pre,
                other_mem_id: other_mem_id.member_id || "",
                other_mem_name: other_mem_name?.full_name || ""
            };
        }

        if (isMounted) {
            setPreviews(formattedPreviews);
        }
    };

    fetchAll();

    return () => {
        isMounted = false;
    };
}, [ownUserId, otherUserId]);



    // useEffect(() => {
    //     if (previews.length > 0) {
    //         fetchOtherMember();
    //     }
    // }, [previews.length]);

    // const fetchOtherMember = async () => {
    //     const updatedPreviews = [...previews];
    //     for (let i=0; i<updatedPreviews.length; i++) {

    //         const pre = updatedPreviews[i];
    //         console.log("fetchothermember roomname:", pre.room_name); 
            
    //         var {data: other_mem_id, error: error_id} = await supabase
    //             .from('rooms')
    //             .select('member_id')
    //             .eq('room_name', pre.room_name)
    //             .neq('member_id', ownUserId)
    //             .maybeSingle();
    //         if (error_id || !other_mem_id?.member_id) {
    //             console.log("error finding other member id - chatcontainer:", error_id);
    //             console.log("other_mem exists?:", other_mem_id?.member_id);
    //             continue;
    //         }
            
    //         const {data: other_mem_name, error: error_name} = await supabase
    //             .from('profiles')
    //             .select('full_name')
    //             .eq('id', other_mem_id?.member_id)
    //             .maybeSingle();
    //         if(error_name) {
    //             console.log("error finding other member name:", error_name);
    //         }
    //         updatedPreviews[i] = {
    //             ...pre,
    //             other_mem_id: other_mem_id?.member_id || "",
    //             other_mem_name: other_mem_name?.full_name || ""
    //         };
    //     }
    //     console.log("fetchother preview:", updatedPreviews);

    //     setPreviews(updatedPreviews);
    // }

    return (
    <div style={{ padding: '20px' }}>
        {previews.length === 0 ? (
            <p>No conversations found</p>
        ) : (
            previews.map((preview, index) => (
                <button 
                    key={index}
                    style={{
                        display: 'block',
                        margin: '10px 0',
                        padding: '10px',
                        width: '100%'
                    }}
                    onClick={()=> {
                            console.log(index);
                            setSelectedChat(index);

                        }}
                >
                    {preview.room_name} - {preview.other_mem_name}
                </button>
            ))
        )}
        
        <ChatInstance 
            ownUserId={ownUserId} 
            otherUserId={
                selectedChat !== -1 && previews[selectedChat]
                    ? previews[selectedChat].other_mem_id
                    : otherUserId
            }
        />

    </div>
);
    
}

export default ChatContainer;


/*
Here's what I want to do:
initially, when no other selected: show previews, meaning... 
    from 'rooms' select * where member_id= ownUserId 
        (and  createdAt ascending order?)
    ==> what convos to display

    for each convo gotten from above..
    from 'rooms' select member_id where room_name = above_roomname and member_id != ownid
    ==> will give other person name to display for preview

each preview is a button that will navigate? to 
    the chat instance
*/