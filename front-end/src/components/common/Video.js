import React from 'react';
import { Player } from 'video-react';

export default function Video( props ) {
  return (
    <Player
      playsInline
      poster={props.poster}
      src={props.src}
    />
  );
};
