import React from 'react';
import GraphDisplay from './components/GraphDisplay';
import { ConfigProvider } from './contexts/config.context';
import { GraphingDataProvider } from './contexts/graphingData.context';
import Home from './view/Home';

function App() {
  return (
    <>
      <ConfigProvider>
        <GraphingDataProvider>
          <Home/>
        </GraphingDataProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
