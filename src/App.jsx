import './App.css';
import { Header } from './components/header';
import Histogram from './components/histogram';

export default function App() {
  return (
    <div className='flex flex-col items-center'>
      <Header className="text-gray-800 font-extrabold text-wrap mb-32">
        ------| DASHBOARD |------
      </Header>
      <Histogram className="w-20" dataSources={[
        ['../public/reports/btc/labels.csv', '5'],
        ['../public/reports/btc/predictions.csv', '5'],
      ]}
      bins={25}
      />
    </div>
  )
}
