import React from 'react';

export interface WishRequest {
  name: string;
  age: string;
  relationship: string;
  hobbies: string;
  tone: 'Funny' | 'Sincere' | 'Poetic' | 'Short' | 'Creative';
}

export interface WishResponse {
  message: string;
}

export type ViewState = 'INTRO_ENVELOPE' | 'DASHBOARD' | 'APP_CAKE' | 'APP_RECORDER' | 'APP_ALBUM' | 'APP_SIGNATURE' | 'APP_WISH' | 'APP_GIFT';

export interface AppIconProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}