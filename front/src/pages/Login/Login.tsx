import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Register/Register.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível fazer login.");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível fazer login.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <main className="login-page">
      <header className="auth-header">
        <Link to="/" className="auth-brand">CCDD <span>Ensino</span></Link>
      </header>
      <section className="login-card">
        <div className="login-header">
          <p className="auth-eyebrow">Área do professor</p>
          <h1>Bem-vindo de volta.</h1>
          <p>Entre para gerenciar suas videoaulas e materiais.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Seu email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Sua senha"
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" name="remember" />
              Lembrar e-mail
            </label>

          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Acessar"}
          </button>
          {error && <p role="alert" className="login-error">{error}</p>}
        </form>

        <p className="register-link">
          Não tem uma conta?{" "}
          <Link to="/register">Criar conta de professor</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
