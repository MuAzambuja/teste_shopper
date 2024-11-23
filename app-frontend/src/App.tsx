import { useState } from 'react'
import './App.css'

export default function App() {

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  return (
    <div className='body'>

      <div className='header'>
        <h1>Muzer</h1>
      </div>

      <div className='center'>

        <div className='destino'>
          <h1>Solicite uma viagem</h1>

          <form className='form-trip' /*onSubmit={handleSubmit}*/>
            <div className='div-inputs'>
              <input 
                type='text'
                id='origin'
                name='origin'
                value={origin}
                onChange={(e)=>setOrigin(e.target.value)}
                placeholder='Informe o local'
                required
              />
            </div>
            <div className='div-inputs'>
              <input
                type='text'
                id='destination'
                name='destination'
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder='Informe o destino'
                required
              />
            </div>
            <button type='submit' className='btn-submit'>
              Ver preços
            </button>
          </form>          
        </div>

        <div className='condutores'>
          <h2>Escolha o condutor</h2>
        </div>

        <div className='mapaRotas'>
          <h2>Mapa</h2>
        </div>

      </div>
      <div className='footer'>
        <h1>Muzer</h1>
        <p>Murilo Azambuja © - 2024 -Todos os direitos reservados</p>
      </div>
    </div>
  )
}