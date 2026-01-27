
import './App.css'
import { User, MessageCircle, Heart, X } from 'lucide-react'
import { useState } from 'react'
import { LikeHandler } from './utils/likeHandler'



const ProfileGenerator = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [particles, setParticles] = useState([]);

  const likeHandler = new LikeHandler(setIsLiked, setParticles);
  const handleLike = () => likeHandler.handleLike();

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-md shadow-lg">
      <div className="relative">
        <img src='http://192.168.0.83:8080/src/main/resources/images/059e35cf-9afb-4012-b23c-8ebd56a6d988.jpg' />
        <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-black p-4">
          <h2 className='text-3xl font-bold'>Mike Varshovski, 36</h2>
        </div>
      </div>
      <div className="p-4">
        <p className='text-gray-600'>I am family medicine doctor, dog-dad to Bear, amateur boxer.
          Currently living in Long Island</p>
      </div>
      <div className="flex justify-around p-4">
        <button className="button" onClick={handleLike}>
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
        <button className="button">
          <X size={32} color="#6b7280" onClick={() => alert('Disliked!')} />
        </button>
      </div>
    </div>
  )
};


const MatchesList = () => {
  return (
    <div className='rounded-lg shadow-lg p-4'>
      <h1>Matches List</h1>
      <ul>
        {[
          { id: 1, name: 'Mike', imageUrl: 'http://192.168.0.83:8080/src/main/resources/images/3a0def1e-e83c-4df9-a279-645d179e18b2.jpg' },
          { id: 2, name: 'Sylvester', imageUrl: 'http://192.168.0.83:8080/src/main/resources/images/3a0def1e-e83c-4df9-a279-645d179e18b2.jpg' },
        ].map(match => (
          <li key={match.id}>
            <button className='flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg w-full'>
            <img
              src={match.imageUrl}
              alt={match.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span className="flex text-lg font-medium">{match.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}




function App() {

  const [currentScreen, setCurrentScreen] = useState('profiles');

  const screen = () => {
    switch (currentScreen) {
      case 'profiles':
        return <ProfileGenerator />;
      case 'matches':
        return <MatchesList />;
    }
  }

  return (
    <>
      <div className='max-w-md mx-auto'>
        <nav className='flex justify-between'>
          <User size={48} color="#3b82f6" onClick={() => setCurrentScreen('profiles')} />
          <MessageCircle size={48} color="#22c55e" onClick={()=> setCurrentScreen('matches')} />
        </nav>
        {screen()}
      </div>
    </>
  )
}

export default App
