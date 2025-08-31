import React, { useEffect, useState } from 'react';
import { DiscordMessage } from '../../../../Common/Interface/Internal/discord';
import './discord-announcements.css';

const DiscordAnnouncements: React.FC = () => {
  const [messages, setMessages] = useState<DiscordMessage[]>([]);

import { getDiscordAnnouncements } from '../../api/discord';

  useEffect(() => {
    getDiscordAnnouncements()
      .then(data => setMessages(data.messages));
  }, []);

  return (
    <div className="discord-announcements">
      <h2>Discord Announcements</h2>
      <div className="discord-messages">
        {messages.map(message => (
          <div key={message.id} className="discord-message">
            <div className="discord-message-author">
              <img src={message.author.avatar} alt={message.author.username} />
              <span>{message.author.username}</span>
            </div>
            <div className="discord-message-content">
              {message.content}
            </div>
            <div className="discord-message-timestamp">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscordAnnouncements;
