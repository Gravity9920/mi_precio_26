import { useEffect, useState } from 'react'
import axios from 'axios'
import logo from './assets/logo.png'
import './App.css'

function App() {
  const [precios, setPrecios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false) // Estado para el botón
  const [error, setError] = useState(null)

  const API_URL = '/api/precios'
  const N8N_WEBHOOK = 'https://n8n.gravity.net.pe/webhook/actualizar_precios' // Reemplaza con tu Webhook de n8n

  const fetchPrecios = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setPrecios(response.data || [])
      setLoading(false)
    } catch (err) {
      setError("Error de conexión con el servidor")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrecios()
  }, [])

  // Función para disparar el Webhook de n8n
  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await axios.post(N8N_WEBHOOK) 
      
      setTimeout(() => {
        fetchPrecios()
        setIsUpdating(false)
        alert("✅ ¡Precios actualizados Correctamente!")
      }, 2000)
    } catch (err) {
      console.error(err)
      setIsUpdating(false)
      alert("❌ Falló la conexión al actualizar. Intenta de nuevo.")
    }
  }

  const filtrados = precios.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(busqueda.toLowerCase())
    )
  )

  return (
    <div className="main-wrapper">
      <div className="glass-card">
        <header className="app-header">

  <div className="app-header-left">
    <img src={logo} alt="Achahui Logo" className="logo-achahui" />
    
    <div className="header-text">
      <h1>Catálogo Achahui 2026</h1>
      <p className="subtitle">Gestión de Precios en tiempo real</p>
    </div>
  </div>

  <button 
    className={`refresh-btn ${isUpdating ? 'spinning' : ''}`} 
    onClick={handleUpdate}
    disabled={isUpdating}
  >
    {isUpdating ? '⌛ Actualizando...' : '🔄 Sincronizar'}
  </button>

</header>


        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar por colegio, prenda, género o talla..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="aesthetic-input"
          />
        </div>

        <div className="table-container">
          {loading ? (
            <p className="loading-text">Cargando base de datos...</p>
          ) : (
            <table className="aesthetic-table">
              <thead>
                <tr>
                  <th>Colegio</th>
                  <th>Prenda</th>
                  <th>Género</th>
                  <th>Talla</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item, i) => (
                  <tr key={i} className="row-fade">
                    <td><strong>{item.colegio}</strong></td>
                    <td>{item.prenda}</td>
                    <td><span className={`badge ${item.genero?.toLowerCase()}`}>{item.genero}</span></td>
                    <td><span className="size-label">{item.talla}</span></td>
                    <td className="price-tag">S/ {parseFloat(item.precio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtrados.length === 0 && (
            <p className="no-results">No se encontró "{busqueda}" en el inventario. 😟</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App