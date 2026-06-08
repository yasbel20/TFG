import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { BACKEND_API_URL } from "./constants/api";

const API = BACKEND_API_URL;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Persiste la sesión entre recargas leyendo localStorage al arrancar
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("inclugo_user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("inclugo_token"));
  const [favs,  setFavs]  = useState([]);

  // Actualiza solo el objeto usuario (sin cambiar el token)
  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("inclugo_user", JSON.stringify(u));
  };

  // Guarda usuario + token en estado y localStorage tras login/registro
  const save = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("inclugo_user",  JSON.stringify(u));
    localStorage.setItem("inclugo_token", t);
  };

  // Limpia todo al hacer logout
  const clear = () => {
    setUser(null);
    setToken(null);
    setFavs([]);
    localStorage.removeItem("inclugo_user");
    localStorage.removeItem("inclugo_token");
  };

  // Carga los favoritos del servidor cada vez que cambia la sesión
  useEffect(() => {
    if (!user || !token) { setFavs([]); return; }
    fetch(`${API}/favoritos`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(r => r.json())
      .then(data => setFavs(Array.isArray(data) ? data.filter(f => f && typeof f === "object") : []))
      .catch(() => setFavs([]));
  }, [user?.email, token]);

  // Set de IDs para comprobar si un evento está en favoritos en O(1)
  const favIds = useMemo(() => new Set(favs.map(f => String(f.id))), [favs]);

  // Actualización optimista: añade al estado local antes de esperar al servidor.
  // Si falla, revierte el cambio.
  const addFav = useCallback(async (ev) => {
    if (!token) return;
    setFavs(prev => prev.some(f => String(f.id) === String(ev.id)) ? prev : [...prev, ev]);
    try {
      const res = await fetch(`${API}/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ evento: ev }),
      });
      const data = await res.json();
      if (data.favoritos) setFavs(data.favoritos.filter(f => f && typeof f === "object"));
    } catch {
      setFavs(prev => prev.filter(f => String(f.id) !== String(ev.id)));
    }
  }, [token]);

  // También optimista: elimina del estado local antes de la respuesta del servidor
  const removeFav = useCallback(async (evId) => {
    if (!token) return;
    setFavs(prev => prev.filter(f => String(f.id) !== String(evId)));
    try {
      await fetch(`${API}/favoritos/${evId}`, {
        method: "DELETE",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
      });
    } catch {}
  }, [token]);

  // Llama a POST /register y guarda la sesión automáticamente
  const register = useCallback(async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    save(data.user, data.token);
  }, []);

  // Llama a POST /login y guarda la sesión
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    save(data.user, data.token);
  }, []);

  // Elimina el token en el servidor y limpia el estado local
  const logout = useCallback(async () => {
    if (token) {
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      }).catch(() => {});
    }
    clear();
  }, [token]);

  // Wrapper de fetch que añade automáticamente el token Bearer a cualquier petición
  const authFetch = useCallback((url, opts = {}) => {
    return fetch(`${API}${url}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        ...opts.headers,
      },
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, authFetch, setUser: saveUser, favs, favIds, addFav, removeFav }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
