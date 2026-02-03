
import './App.css'
import { User, MessageCircle, Heart, X, FerrisWheel } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LikeHandler } from './utils/likeHandler'

const fetchRandomProfile = async () => {
 const profiles = await fetch('http://localhost:8080/api/profiles/random');
 if(!profiles.ok) {
  throw new Error ('Failed to fetch profiles');
 }
 return profiles.json();
};

const getMatches  = async () => {
 const matches = await fetch('http://localhost:8080/api/matches');
 if(!matches.ok) {
  throw new Error ('Failed to fetch matches');
 }
 return matches.json();
};

const fetchConversations = async (conversationId) => {
 const conversations = await fetch(`http://localhost:8080/getConverstions/${conversationId}`);
 if(!conversations.ok) {
  throw new Error ('Failed to fetch conversations');
 }
 return conversations.json();
};


const ProfileGenerator = ({profile, onSwipe}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [particles, setParticles] = useState([]);

  const likeHandler = new LikeHandler(setIsLiked, setParticles);
  const handleLike = (profileId) => likeHandler.handleLike(profileId);

  const handleSwipe = (direction) => {
    if(direction === 'right') {
      handleLike(profile.id);
      
    }
    onSwipe(direction);
  }

  return profile ? (
    <div className="rounded-lg overflow-hidden bg-white shadow-md shadow-lg">
      <div className="relative">
        <img src={`http://192.168.0.83:8082/src/main/resources/images/${profile.imageUrl}`} />
        <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-black p-4">
          <h2 className='text-3xl font-bold'>{profile.firstName} {profile.lastName}, {profile.age}</h2>
        </div>
      </div>
      <div className="p-4">
        <p className='text-gray-600'>{profile.bio}</p>
      </div>
      <div className="flex justify-around p-4">
        <button className="button" onClick={() => handleSwipe('right')}>
          <Heart
            size={32}
            color="#ef4444"
            fill={isLiked ? "#ef4444" : "none"}
            className={isLiked ? "heart-animate" : ""}
          />
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle particle-animate"
              style={{
                '--tx': `translate(${particle.tx}px, ${particle.ty}px)`
              }}
            />
          ))}
          {/* Add an option to start chat if already matched  */}
        </button>
        <button className="button" onClick={() => handleSwipe('left')}>
          <X size={32} color="#6b7280" />
        </button>
      </div>
    </div>
  )
 : ( <div>Loading...</div> );
};


const MatchesList = ({ matches,onSelect }) => {

  return (
    <div className='rounded-lg shadow-lg p-4'>
      <h2 className='text 2xl font-bold mb-4'>Matches List</h2>
      <ul className='h-[50vh] border rounded overflow-y-auto mb-4 p-2'>
        {matches.map(match => (
          <li key={match.id}>
            <button className='flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg w-full'
            onClick={() => onSelect(match.profile, match.conversationId)}>
            <img
              src={`http://192.168.0.83:8082/src/main/resources/images/${match.profile.imageUrl}`}
              alt={match.profile.firstName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span className="flex text-lg font-medium">{match.profile.firstName} {match.profile.lastName}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}



const ChatScreen = ({currentMatch, conversation}) => {


  const[input,setInput] = useState('');

  

  const handleSend = () => {
    if(input.trim() === '') return;
    console.log('Sending message:', input);
    setInput('');
  }

  return currentMatch ?(
    <div className='rounded-lg shadow-lg p-4'>
      <h2 className='text 2xl font-bold mb-4'>Chat with {currentMatch.firstName}</h2>
      <div className='h-[50vh] border rounded overflow-y-auto mb-4 p-2'>
      {conversation && conversation.map((message, index) => (
        <div key={index} className='mb-2'>
          <div className='mb-4 p-2 rounded bg-gray-200 w-fit'>{message.content || message}</div>
        </div>
      ))
      }
      </div>
      <div className='flex'>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='flex-grow border rounded-l px-4 py-2 focus:outline-none'
          placeholder='Type your message...'
        />
        <button onClick={() => handleSend()} 
        className='bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600'>
          Send
        </button>
      </div>

    </div>
  ) : (<div>Loading Chat...</div>);
}



function App() {


  const loadRandomProfile = async () => {
    try {
      const data = await fetchRandomProfile();
      console.log('Fetched profile:', data);
      setCurrentProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const data = await getMatches();
      console.log('Fetched matches:', data);
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };
  useEffect(() => {
    loadRandomProfile();
    loadMatches();
  }, []);


  const [currentScreen, setCurrentScreen] = useState('profiles');
  const [currentProfile, setCurrentProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentChat, setCurrentChat] = useState({ match: {}, conversation: [] });

  const onSwipe = (direction) => {
    console.log('Swiped:', direction);
    loadRandomProfile();
    if(direction === 'right') {
      // Reload matches after a like in case it created a new match
      loadMatches();
    }
  };

  const onSelectMatch = async(profile, conversationId) => {
    const conversation = await fetchConversations(conversationId);
    setCurrentChat({match : profile , conversation : conversation.messages});
    setCurrentScreen('chats');
  }

  const screen = () => {
    switch (currentScreen) {
      case 'profiles':
        return <ProfileGenerator profile={currentProfile} onSwipe={onSwipe}/>;
      case 'matches':
        return <MatchesList matches={matches} onSelect={onSelectMatch} />;
      case 'chats':
        return <ChatScreen currentMatch={currentChat.match} conversation={currentChat.conversation} />;
    }
  }

  return (
    <>
      <div className='max-w-md mx-auto'>
        <nav className='flex justify-between'>
          <User size={48} color="#3b82f6" onClick={() => setCurrentScreen('profiles')} />
          <MessageCircle size={48} color="#22c55e" onClick={() => {
            setCurrentScreen('matches');
            loadMatches();
          }} />
        </nav>
        {screen()}
      </div>
    </>
  )
}

export default App
