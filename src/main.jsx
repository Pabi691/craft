import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Root from './Root';

// No StrictMode, matching the reference app: its double-invoked effects
// would fire every storefront API call twice in development.
ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
