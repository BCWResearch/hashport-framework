import './App.css';
import './polyfills.ts';
import { LazyHashportWidget } from '@hashport/widget';

function App() {
    return (
        <>
            <h1>hashport widget</h1>
            <LazyHashportWidget label="Open Widget" widgetProps={{ mode: 'testnet' }} />
        </>
    );
}

export default App;
