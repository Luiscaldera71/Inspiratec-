import React, { useState } from 'react';

export const Tabs = ({ tabs, defaultActive = 0, onChange, className = '' }) => {
  const [active, setActive] = useState(defaultActive);

  const handleTabClick = (index) => {
    setActive(index);
    if (onChange) onChange(index, tabs[index]);
  };

  return (
    <div className={`ui-tabs-container ${className}`}>
      <div className="ui-tabs-list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={active === index}
            className={`ui-tab ${active === index ? 'ui-tab-active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ui-tabs-content" role="tabpanel" tabIndex={0}>
        {tabs[active]?.content}
      </div>
    </div>
  );
};
