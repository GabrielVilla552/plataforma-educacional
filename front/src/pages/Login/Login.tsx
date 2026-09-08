import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    navigate("/dashboard");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>CCDD - Ensino</h1>

        <div className="login-header">
          <h2>Bem vindo!</h2>
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

            <a href="/forgot-password">Esqueceu sua senha?</a>
          </div>

          <button type="submit">Acessar</button>
        </form>

        <p className="register-link">
          Não tem uma conta?{" "}
          <a href="/register">Cadastrar</a>
        </p>
      </section>
    </main>
  );
}

export default Login;
