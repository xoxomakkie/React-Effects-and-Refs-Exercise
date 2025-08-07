import React, { useState, useEffect } from "react";

const DeckOfCards = () => {
  const [deckId, setDeckId] = useState(null);
  const [card, setCard] = useState(null);
  const [remaining, setRemaining] = useState(52);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    async function fetchDeck() {
      const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
      const data = await res.json();
      setDeckId(data.deck_id);
      setRemaining(data.remaining);
      setCard(null);
    }
    fetchDeck();
  }, []);

  const drawCard = async () => {
    if (remaining === 0) {
      alert("Error: no cards remaining!");
      return;
    }
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await res.json();

    if (data.success && data.cards.length > 0) {
      setCard(data.cards[0]);
      setRemaining(data.remaining);
    } else {
      alert("Error: no cards remaining!");
    }
  };

  const shuffleDeck = async () => {
    if (!deckId) return;
    setShuffling(true);
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    const data = await res.json();

    if (data.success) {
      setRemaining(data.remaining);
      setCard(null);
    } else {
      alert("Error: could not shuffle deck!");
    }
    setShuffling(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h1>Deck of Cards</h1>
      {card ? (
        <div>
          <img src={card.image} alt={`${card.value} of ${card.suit}`} style={{ height: "200px" }} />
          <p>
            {card.value} of {card.suit}
          </p>
        </div>
      ) : (
        <p>Click the button to draw a card.</p>
      )}

      <button onClick={drawCard} disabled={!deckId || remaining === 0 || shuffling}>
        Draw a Card
      </button>

      <button onClick={shuffleDeck} disabled={!deckId || shuffling} style={{ marginLeft: "10px" }}>
        {shuffling ? "Shuffling..." : "Shuffle Deck"}
      </button>

      <p>Cards Remaining: {remaining}</p>
    </div>
  );
};

export default DeckOfCards;
