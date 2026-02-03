export class LikeHandler {
  constructor(setIsLiked, setParticles) {
    this.setIsLiked = setIsLiked;
    this.setParticles = setParticles;
  }

  handleLike(profileId) {
    this.setIsLiked(true);
    
    
    const newParticles = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 360) / 8;
      const distance = 40;
      const tx = Math.cos(angle * Math.PI / 180) * distance;
      const ty = Math.sin(angle * Math.PI / 180) * distance;
      return { id: i, tx, ty };
    });
    
    this.setParticles(newParticles);
    
    setTimeout(() => {
      this.setIsLiked(false);
      this.setParticles([]);
    }, 600);

    const saveMatch = async (profileId) => {
      const response = await fetch('http://localhost:8080/api/matches/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });
      if (!response.ok) {
        console.error('Failed to save match');
      }
    }
    saveMatch(profileId);
  }
  
}
