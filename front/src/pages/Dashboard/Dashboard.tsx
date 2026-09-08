import "./Dashboard.css";

const courses = [
  {
    id: 1,
    title: "Programação de Computadores I",
    description: "Aprenda os básicos de programação para qualquer linguagem.",
    progress: 100,
  },
  {
    id: 2,
    title: "GPMS",
    description: "Aprenda a planejar e gerir projetos de Software.",
    progress: 40,
  },
];

function Dashboard() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Bem vindo(a) <i>Usuário</i></h1>
          <p>Continue com seu aprendizado.</p>
        </div>

        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Perfil</a>
        </nav>
      </header>

      <section className="courses">
        <h2>Meus Cursos</h2>

        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.id}>
              <div className="course-image">
                Course Image
              </div>

              <div className="course-content">
                <h3>{course.title}</h3>

                <p>{course.description}</p>

                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <span>{course.progress}% completo</span>

                <a href={`/courses/${course.id}`}>
                  Continuar →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;