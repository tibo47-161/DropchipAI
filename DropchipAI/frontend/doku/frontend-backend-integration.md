# Frontend-Backend Integration Guide

## Übersicht
Dieses Dokument beschreibt, wie das Frontend mit dem Backend der DropchipAI-Anwendung kommuniziert.

## API-Konfiguration

### Basis-URL
Die API-Basis-URL wird in der `.env`-Datei konfiguriert:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Ändern Sie diese URL entsprechend Ihrer Umgebung (Entwicklung, Produktion, etc.).

### API-Service-Einrichtung

Erstellen Sie eine Datei `services/api.js` mit folgendem Inhalt:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Axios-Instanz mit Basis-URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request-Interceptor für Auth-Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response-Interceptor für Fehlerbehandlung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatisches Logout bei Authentifizierungsfehlern
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## API-Endpunkte

### Authentifizierung

```javascript
// services/auth.js
import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};
```

### Produkt-API

```javascript
// services/products.js
import api from './api';

export const productService = {
  searchProducts: (keywords) => api.get('/products/search', { params: { keywords } }),
  getProductDetails: (productId) => api.get(`/products/${productId}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (productId, productData) => api.put(`/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/products/${productId}`)
};
```

### Automatisierungs-API

```javascript
// services/automation.js
import api from './api';

export const automationService = {
  scheduleJob: (jobType, parameters) => api.post('/automation/jobs', { jobType, parameters }),
  getJobStatus: (jobId) => api.get(`/automation/jobs/${jobId}`),
  cancelJob: (jobId) => api.delete(`/automation/jobs/${jobId}`),
  executeAllJobs: () => api.post('/automation/jobs/execute-all')
};
```

## Verwendung in Komponenten

Beispiel für die Verwendung in einer React-Komponente:

```javascript
import React, { useState, useEffect } from 'react';
import { productService } from '../services/products';

function ProductSearch() {
  const [keywords, setKeywords] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.searchProducts(keywords);
      setProducts(response.data);
    } catch (err) {
      setError('Fehler bei der Produktsuche. Bitte versuchen Sie es erneut.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Produktsuche</h2>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={keywords} 
          onChange={(e) => setKeywords(e.target.value)} 
          placeholder="Suchbegriffe eingeben"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Suche...' : 'Suchen'}
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
      
      <div className="products-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Preis: {product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSearch;
```

## CORS-Konfiguration im Backend

Stellen Sie sicher, dass das Backend CORS-Anfragen vom Frontend zulässt. In der Backend-Anwendung sollte folgende Konfiguration vorhanden sein:

```python
# In app.py oder einer ähnlichen Datei
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # In Produktion einschränken!
```

## Fehlerbehandlung

Implementieren Sie eine konsistente Fehlerbehandlung im Frontend:

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Der Server hat mit einem Statuscode außerhalb des Bereichs 2xx geantwortet
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return `Ungültige Anfrage: ${data.message || 'Bitte überprüfen Sie Ihre Eingaben.'}`;
      case 401:
        return 'Nicht autorisiert. Bitte melden Sie sich an.';
      case 403:
        return 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
      case 404:
        return 'Ressource nicht gefunden.';
      case 500:
        return 'Serverfehler. Bitte versuchen Sie es später erneut.';
      default:
        return `Fehler: ${data.message || 'Ein unbekannter Fehler ist aufgetreten.'}`;
    }
  } else if (error.request) {
    // Die Anfrage wurde gestellt, aber keine Antwort erhalten
    return 'Keine Antwort vom Server. Bitte überprüfen Sie Ihre Internetverbindung.';
  } else {
    // Etwas ist beim Einrichten der Anfrage schief gelaufen
    return `Fehler: ${error.message}`;
  }
};
```

## Authentifizierung und Autorisierung

Verwenden Sie einen AuthContext, um den Authentifizierungsstatus in der gesamten Anwendung zu verwalten:

```javascript
// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Token validieren oder Benutzerdaten abrufen
      authService.validateToken(token)
        .then(response => {
          setCurrentUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    setCurrentUser(user);
    return user;
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Geschützte Routen

Implementieren Sie geschützte Routen, die nur für authentifizierte Benutzer zugänglich sind:

```javascript
// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Laden...</div>;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
```

Verwendung in der App.js:

```javascript
// pages/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Dashboard from './dashboard';
import ProductResearch from './product_research';
import BulkLister from './bulk_lister';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product-research" element={<ProductResearch />} />
          <Route path="/bulk-lister" element={<BulkLister />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
```
