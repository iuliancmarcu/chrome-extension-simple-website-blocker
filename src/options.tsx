import React from 'react';
import { createRoot } from 'react-dom/client';

import { OptionsPage } from './OptionsPage';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>,
);
