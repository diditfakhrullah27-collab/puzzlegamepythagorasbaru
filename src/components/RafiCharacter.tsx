/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { RafiEmotion, RafiPose } from '../types/game';

interface RafiCharacterProps {
  emotion: RafiEmotion;
  pose?: RafiPose;
  isTalking: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const RafiCharacter: React.FC<RafiCharacterProps> = ({
  emotion,
  pose,
  isTalking,
  size = 'md',
  className = '',
}) => {
  const [mouthOpen, setMouthOpen] = useState(false);

  // Synchronized mouth flapping animation during active speech
  useEffect(() => {
    if (!isTalking) {
      setMouthOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 130);

    return () => clearInterval(interval);
  }, [isTalking]);

  // Map emotion & mouth state to consistent high-res portrait assets
  const getPortraitSrc = (): string => {
    if (mouthOpen) {
      switch (emotion) {
        case 'happy':
          return '/assets/rafi/rafi_portrait_laugh_open.png';
        case 'surprised':
          return '/assets/rafi/rafi_portrait_surprised_open.png';
        case 'excited':
          return '/assets/rafi/rafi_portrait_cheer_open.png';
        case 'thinking':
          return '/assets/rafi/rafi_portrait_neutral_open.png';
        case 'serious':
          return '/assets/rafi/rafi_portrait_neutral_open.png';
        case 'sad':
          return '/assets/rafi/rafi_portrait_neutral_open.png';
        default:
          return '/assets/rafi/rafi_portrait_neutral_open.png';
      }
    }

    // Closed / resting expression (using matching head portraits, NEVER incompatible torso busts)
    switch (emotion) {
      case 'happy':
        return '/assets/rafi/rafi_portrait_laugh_open.png';
      case 'thinking':
        return '/assets/rafi/rafi_portrait_think_closed.png';
      case 'serious':
        return '/assets/rafi/rafi_portrait_serious_closed.png';
      case 'sad':
        return '/assets/rafi/rafi_portrait_sad_closed.png';
      case 'surprised':
        return '/assets/rafi/rafi_portrait_surprised_open.png';
      case 'excited':
        return '/assets/rafi/rafi_portrait_cheer_open.png';
      default:
        return '/assets/rafi/rafi_portrait_neutral_open.png';
    }
  };

  // Full-body pose sprite
  const getPoseSrc = (): string => {
    switch (pose) {
      case 'pointing':
        return '/assets/rafi/rafi_pose_pointing.png';
      case 'presenting':
        return '/assets/rafi/rafi_pose_presenting.png';
      case 'arms_crossed':
        return '/assets/rafi/rafi_pose_arms_crossed.png';
      case 'running':
        return '/assets/rafi/rafi_pose_running.png';
      case 'victory_jump':
        return '/assets/rafi/rafi_pose_victory_jump.png';
      case 'thinking':
        return '/assets/rafi/rafi_pose_thinking.png';
      case 'reading_book':
        return '/assets/rafi/rafi_pose_reading_book.png';
      case 'holding_pencil':
        return '/assets/rafi/rafi_pose_holding_pencil.png';
      case 'standing':
      default:
        return '/assets/rafi/rafi_pose_standing.png';
    }
  };

  if (size === 'full') {
    return (
      <div className={`relative flex items-end justify-center pointer-events-none select-none ${className}`}>
        <img
          src={getPoseSrc()}
          alt="Rafi Character"
          className="max-h-[24vh] sm:max-h-[32vh] md:max-h-[42vh] landscape:max-h-[24vh] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-all duration-300"
        />
      </div>
    );
  }

  // Portrait inside dialogue box
  const sizeClasses = {
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
  }[size];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 border-2 sm:border-3 border-amber-600 shadow-md flex items-center justify-center p-0.5 select-none ${sizeClasses} ${className}`}
    >
      <img
        src={getPortraitSrc()}
        alt={`Rafi (${emotion})`}
        className={`w-full h-full object-contain filter drop-shadow transition-all duration-150 ${
          isTalking ? 'scale-[1.03] -translate-y-0.5' : 'scale-100 translate-y-0'
        }`}
      />
      {isTalking && (
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
      )}
    </div>
  );
};
