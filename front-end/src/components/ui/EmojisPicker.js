import { Logger } from 'react-logger-lib';

import EmojiPicker from 'emoji-picker-react';

export default function EmojisPicker() {
  const log = Logger.of( EmojisPicker.name);
  
  return (
      <EmojiPicker />
  );
}