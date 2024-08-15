import './app.css';
import Playground from './components/playground';

function App() {
  window.addEventListener('beforeunload',function(ev){
    ev.preventDefault()
    ev.returnValue = ''
    const message = 'Are you sure u want to leave?'
    ev.returnValue = message
  })
  return (
      <Playground/>
  );
}

export default App;
