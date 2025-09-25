import React from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const QUICK_CHIPS = ['nature', 'mountains', 'city', 'cats', 'flowers'];

export const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-title">Discover Amazing Photos</h2>
        <p className="hero-subtitle">Search for high-quality images or try one of our suggestions</p>
        
        <div className="quick-chips">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="chip"
              onClick={() => onSearch(chip)}
              disabled={isLoading}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
