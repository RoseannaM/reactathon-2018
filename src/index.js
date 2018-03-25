import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import netlifyIdentity from 'netlify-identity-widget';
import unregister from './registerServiceWorker';

window.netlifyIdentity = netlifyIdentity
// You must run this once before trying to interact with the widget
netlifyIdentity.init()

unregister();
ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
