// Formas geométricas decorativas para o fundo do login

import React from 'react';

export function GeometricShapes() {
  return (
    <>
      {/* Formas geométricas decorativas animadas */}
      <div className="absolute top-20 left-20 w-16 h-16 border-2 border-primary/30 rotate-45 animate-float" />
      <div className="absolute top-40 right-32 w-8 h-8 bg-primary/20 rotate-12 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-32 w-12 h-12 border border-accent/30 rotate-45 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-accent/30 rounded-full animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 border border-primary/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-60 left-1/3 w-20 h-20 border border-silver/20 rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Diamond shapes como na imagem de referência */}
      <div className="absolute top-24 left-40 w-10 h-10 bg-gradient-to-br from-primary/30 to-transparent rotate-45" />
      <div className="absolute top-16 left-48 w-6 h-6 bg-gradient-to-br from-accent/20 to-transparent rotate-45" />
    </>
  );
}
