import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      area: String(formData.get("area") || "") || null,
      institution: String(formData.get("institution") || "") || null,
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Não foi possível criar sua conta.");
      navigate("/login");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível criar sua conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <header className="auth-header">
        <Link to="/" className="auth-brand">CCDD <span>Ensino</span></Link>
      </header>

      <section className="register-card">
        <div className="login-header">
          <p className="auth-eyebrow">Área do professor</p>
          <h1>Crie sua conta.</h1>
          <p>Publique e organize seu conteúdo educacional em um só lugar.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" type="text" placeholder="Seu nome completo" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Seu email" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="area">Área de atuação</label>
              <input id="area" name="area" type="text" placeholder="Ex.: Matemática" />
            </div>

            <div className="form-group">
              <label htmlFor="institution">Instituição</label>
              <input id="institution" name="institution" type="text" placeholder="Sua instituição" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" minLength={8} placeholder="Mínimo de 8 caracteres" required />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </button>
          {error && <p role="alert" className="login-error">{error}</p>}
        </form>

        <p className="register-link">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
