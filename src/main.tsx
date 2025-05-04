import { render } from 'preact'
import './index.css'
import App from './components/App.tsx'

render(<App />, document.querySelector("div#app") as Element)
