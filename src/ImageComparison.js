import React, { useState, useEffect } from 'react';

const ImageComparison = () => {
  const [images, setImages] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  const [remainingPairs, setRemainingPairs] = useState([]);
  const [finalRankings, setFinalRankings] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    const actualImages = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      url: `${process.env.PUBLIC_URL}/images/img (${i + 1}).jpg`,
      elo: 1400
    }));
    setImages(actualImages);
    generatePairs(actualImages);
  };

  const generatePairs = (images) => {
    const pairs = [];
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        pairs.push([images[i], images[j]]);
      }
    }
    setRemainingPairs(pairs);
    setNextPair(pairs);
  };

  const setNextPair = (pairs) => {
    if (pairs.length > 0) {
      const randomIndex = Math.floor(Math.random() * pairs.length);
      setCurrentPair(pairs[randomIndex]);
      setRemainingPairs(pairs.filter((_, index) => index !== randomIndex));
    }
  };

  const handleSelection = (selectedId) => {
    const [img1, img2] = currentPair;
    const newComparison = {
      winner: selectedId,
      loser: selectedId === img1.id ? img2.id : img1.id,
    };
    console.log('Comparison result:', newComparison);
    
    if (remainingPairs.length === 0) {
      updateEloRatings();
    } else {
      setNextPair(remainingPairs);
    }
  };

  const updateEloRatings = () => {
    const updatedImages = [...images];
    const K = 32; // K-factor for ELO calculation

    currentPair.forEach(img => {
      const opponent = currentPair.find(i => i.id !== img.id);
      const expectedScore = 1 / (1 + Math.pow(10, (opponent.elo - img.elo) / 400));
      img.elo += K * (1 - expectedScore);
    });

    updatedImages.sort((a, b) => b.elo - a.elo);
    setImages(updatedImages);
    setFinalRankings(updatedImages);
    console.log('Final rankings:', updatedImages);
  };

  if (finalRankings.length > 0) {
    return (
      <div>
        <h2>Comparison Complete!</h2>
        <p>Thank you for participating. Here are the final rankings:</p>
        <ol>
          {finalRankings.map((image) => (
            <li key={image.id}>
              Image {image.id} - ELO: {Math.round(image.elo)}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div>
      <h1>Image Comparison</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {currentPair.map((image) => (
          <div key={image.id} style={{ margin: '10px' }}>
            <img
              src={image.url}
              alt={`Item ${image.id}`}
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
              }}
            />
            <br />
            <button onClick={() => handleSelection(image.id)} style={{ marginTop: '10px' }}>
              Select This Image
            </button>
          </div>
        ))}
      </div>
      <p>Remaining comparisons: {remainingPairs.length}</p>
    </div>
  );
};

export default ImageComparison;