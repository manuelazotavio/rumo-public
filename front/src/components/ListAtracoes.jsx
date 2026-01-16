import React from 'react';
import CardGuide from './CardGuide';
import CardAttraction from './CardAttraction';


const ListAtracoes = ({ atracoes = [] }) => {
  const safeAtracoes = Array.isArray(atracoes) ? atracoes : [];

  return (
    <div className="list-guides">
      {safeAtracoes.map((item) => (
        <CardAttraction key={item.id} atracao={item} />
      ))}
    </div>
  );
};

export default ListAtracoes;
