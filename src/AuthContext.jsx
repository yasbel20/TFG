import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";

const API = "http://127.0.0.1:8000/api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("inclugo_user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("inclugo_token"));
  const [favs,  setFavs]  = useState([]);

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("inclugo_user", JSON.stringify(u));
  };

  const save = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("inclugo_user",  JSON.stringify(u));
    localStorage.setItem("inclugo_token", t);
  };

  const clear = () => {
    setUser(null);
    setToken(null);
    setFavs([]);
    localStorage.removeItem("inclugo_user");
    localStorage.removeItem("inclugo_token");
  };

  useEffect(() => {
    if (!user || !token) { setFavs([]); return; }
    fetch(`${API}/favoritos`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(r => r.json())
      .then(data => setFavs(Array.isArray(data) ? data.filter(f => f && typeof f === "object") : []))
      .catch(() => setFavs([]));
  }, [user?.email, token]);

  const favIds = useMemo(() => new Set(favs.map(f => String(f.id))), [favs]);

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

  const logout = useCallback(async () => {
    if (token) {
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      }).catch(() => {});
    }
    clear();
  }, [token]);

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
