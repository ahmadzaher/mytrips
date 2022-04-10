import React from 'react';
import ReactDOM from 'react-dom';
import { UserContext } from '../Context/UserContext';
import TheRoutes from './TheRoutes';
function App() {
    return (
        <UserContext value={500}>
            <TheRoutes />
        </UserContext>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
