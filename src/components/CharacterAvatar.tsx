import { useState } from 'react';
import { CharacterInfo } from '../data/characters';

interface CharacterAvatarProps {
  character: CharacterInfo;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CharacterAvatar({ character, size = 'md', className = '' }: CharacterAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClass =
    size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';

  if (imgError) {
    return (
      <div
        className={`${sizeClass} rounded-xl border border-slate-200 flex items-center justify-center shrink-0 ${character.accentBg} ${character.accentText} font-display font-bold text-lg ${className}`}
        aria-label={character.name}
      >
        {character.name.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={character.imageSrc}
      alt={character.name}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`${sizeClass} rounded-xl object-cover border border-slate-200 bg-white shrink-0 ${className}`}
    />
  );
}
