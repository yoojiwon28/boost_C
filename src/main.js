import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import GroupDetail from './pages/GroupDetail';
import Group from './pages/Group';
import PasswordCheck from './pages/PasswordCheck';
import MakeGroup from './pages/MakeGroup';

function Main() {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="group">
            <Route index element={<Group />} />
            <Route path=":groupId" element={<GroupDetail />} />
            <Route path=":groupId/password-check" element={<PasswordCheck />} />
            <Route path="makegroup" element={<MakeGroup />} />
          </Route>
        </Routes>
      </App>
    </BrowserRouter>
  );
}

export default Main;