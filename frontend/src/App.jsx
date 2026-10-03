import { useEffect, useState } from "react";
import {
  Vote,
  ShieldCheck,
  Users,
  BarChart3,
  LogOut,
  User,
  Home,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Plus,
  ChevronRight,
} from "lucide-react";

const API = "http://localhost:3000";

function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(
    localStorage.getItem("voting_token") || ""
  );
  const [user, setUser] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("voting_token", token);
      loadProfile(token);
    }
  }, [token]);

  const loadProfile = async (authToken = token) => {
    try {
      const response = await fetch(`${API}/user/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        logout();
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("voting_token");
    setToken("");
    setUser(null);
    setPage("home");
  };

  const navigate = (newPage) => {
    setPage(newPage);
    setMobileMenu(false);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-inner">
          <button className="brand" onClick={() => navigate("home")}>
            <span className="brand-icon">
              <Vote size={22} />
            </span>

            <span>
              <strong>Vote</strong>
              <small>Portal</small>
            </span>
          </button>

          <nav className={`nav-links ${mobileMenu ? "show" : ""}`}>
            <button onClick={() => navigate("home")}>
              <Home size={17} />
              Home
            </button>

            <button onClick={() => navigate("candidates")}>
              <Users size={17} />
              Candidates
            </button>

            <button onClick={() => navigate("results")}>
              <BarChart3 size={17} />
              Results
            </button>

            {user && (
              <button onClick={() => navigate("profile")}>
                <User size={17} />
                Profile
              </button>
            )}

            {user?.role === "admin" && (
              <button onClick={() => navigate("admin")}>
                <ShieldCheck size={17} />
                Admin
              </button>
            )}

            {!user ? (
              <button
                className="nav-login"
                onClick={() => navigate("login")}
              >
                Login
              </button>
            ) : (
              <button className="nav-logout" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            )}
          </nav>

          <button
            className="menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {page === "home" && (
        <HomePage
          user={user}
          navigate={navigate}
        />
      )}

      {page === "login" && (
        <LoginPage
          setToken={setToken}
          navigate={navigate}
        />
      )}

      {page === "signup" && (
        <SignupPage
          navigate={navigate}
        />
      )}

      {page === "candidates" && (
        <CandidatesPage
          token={token}
          user={user}
          navigate={navigate}
        />
      )}

      {page === "results" && (
        <ResultsPage />
      )}

      {page === "profile" && user && (
        <ProfilePage user={user} />
      )}

      {page === "admin" && user?.role === "admin" && (
        <AdminPage
          token={token}
        />
      )}
    </div>
  );
}


/* ================= HOME ================= */

function HomePage({ user, navigate }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            Secure & Transparent Voting
          </div>

          <h1>
            Your Vote.
            <br />
            <span>Your Voice.</span>
          </h1>

          <p>
            Participate in a secure, simple and transparent digital
            election. Every vote matters.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() =>
                navigate(user ? "candidates" : "login")
              }
            >
              {user ? "View Candidates" : "Get Started"}
              <ChevronRight size={19} />
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("results")}
            >
              View Results
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>100%</strong>
              <span>Secure</span>
            </div>

            <div>
              <strong>1</strong>
              <span>Vote / Person</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Accessible</span>
            </div>
          </div>
        </div>

        <div className="hero-card-wrapper">
          <div className="election-card">
            <div className="card-top">
              <div className="card-icon">
                <Vote size={30} />
              </div>

              <span className="live-badge">
                ● LIVE ELECTION
              </span>
            </div>

            <h3>Digital Election</h3>

            <p>
              Cast your vote securely and make your voice count.
            </p>

            <div className="card-progress">
              <div className="progress-label">
                <span>Voting Progress</span>
                <span>Active</span>
              </div>

              <div className="progress-bar">
                <span />
              </div>
            </div>

            <button
              onClick={() =>
                navigate(user ? "candidates" : "login")
              }
            >
              Enter Voting Booth
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <span>WHY VOTE ONLINE</span>
          <h2>Simple. Secure. Transparent.</h2>
        </div>

        <div className="feature-grid">
          <Feature
            icon={<ShieldCheck />}
            title="Secure Voting"
            text="Authentication and protected voting APIs keep your vote secure."
          />

          <Feature
            icon={<CheckCircle2 />}
            title="One Person, One Vote"
            text="Once you vote, the system prevents duplicate voting."
          />

          <Feature
            icon={<BarChart3 />}
            title="Live Results"
            text="View candidate vote counts through the results dashboard."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}


/* ================= LOGIN ================= */

function LoginPage({ setToken, navigate }) {
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aadharCardNumber: Number(aadharCardNumber),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      setToken(data.token);
      navigate("candidates");

    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue to your voting portal."
    >
      <form onSubmit={login} className="auth-form">
        <label>Aadhar Card Number</label>

        <input
          type="text"
          maxLength="12"
          value={aadharCardNumber}
          onChange={(e) =>
            setAadharCardNumber(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter 12 digit number"
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        {message && (
          <div className="error-message">
            <AlertCircle size={17} />
            {message}
          </div>
        )}

        <button className="primary-button full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("signup")}>
            Create account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}


/* ================= SIGNUP ================= */

function SignupPage({ navigate }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    aadharCardNumber: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const signup = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          aadharCardNumber: Number(form.aadharCardNumber),
          role: "voter",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      setMessage("Account created successfully. Please login.");

      setForm({
        name: "",
        age: "",
        email: "",
        mobile: "",
        address: "",
        aadharCardNumber: "",
        password: "",
      });

    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register to participate in the election."
    >
      <form onSubmit={signup} className="auth-form signup-form">

        <div className="form-row">
          <div>
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              required
            />
          </div>
        </div>

        <label>Email</label>

        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        <label>Mobile</label>

        <input
          value={form.mobile}
          onChange={(e) =>
            update(
              "mobile",
              e.target.value.replace(/\D/g, "")
            )
          }
        />

        <label>Address</label>

        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          required
        />

        <label>Aadhar Card Number</label>

        <input
          maxLength="12"
          value={form.aadharCardNumber}
          onChange={(e) =>
            update(
              "aadharCardNumber",
              e.target.value.replace(/\D/g, "")
            )
          }
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
        />

        {message && (
          <div className="success-message">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        <button className="primary-button full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="auth-switch">
          Already registered?{" "}
          <button type="button" onClick={() => navigate("login")}>
            Login
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}


/* ================= AUTH LAYOUT ================= */

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Vote size={24} />
          VotePortal
        </div>

        <div className="auth-message">
          <span>YOUR VOICE MATTERS</span>

          <h1>
            Make your
            <br />
            <strong>vote count.</strong>
          </h1>

          <p>
            A secure digital voting experience designed
            for simple and transparent elections.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>{title}</h2>

          <p>{subtitle}</p>

          {children}
        </div>
      </div>
    </main>
  );
}


/* ================= CANDIDATES ================= */

function CandidatesPage({ token, user, navigate }) {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [votingId, setVotingId] = useState("");

  const loadCandidates = async () => {
    try {
      const response = await fetch(`${API}/candidate/`);
      const data = await response.json();

      setCandidates(data);
    } catch (error) {
      setMessage("Unable to load candidates");
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const vote = async (candidate) => {
    if (!token) {
      navigate("login");
      return;
    }

    setVotingId(candidate._id);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/candidate/vote/${candidate._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || data.error || "Voting failed");
        return;
      }

      setMessage("Vote recorded successfully!");

    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setVotingId("");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <span>2026 ELECTION</span>
        <h1>Choose your candidate</h1>
        <p>
          Review the candidates and cast your vote securely.
        </p>
      </section>

      {message && (
        <div className="page-message">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="empty-state">
          <Users size={45} />
          <h2>No candidates available</h2>
          <p>
            Candidates will appear here when the election
            administrator adds them.
          </p>
        </div>
      ) : (
        <div className="candidate-grid">
          {candidates.map((candidate, index) => (
            <div className="candidate-card" key={candidate._id || index}>
              <div className="candidate-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="candidate-avatar">
                {candidate.name?.charAt(0).toUpperCase()}
              </div>

              <h2>{candidate.name}</h2>

              <span className="party-badge">
                {candidate.party}
              </span>

              {user?.isVoted ? (
                <button className="voted-button" disabled>
                  <CheckCircle2 size={18} />
                  Already Voted
                </button>
              ) : user?.role === "admin" ? (
                <button className="disabled-button" disabled>
                  Admin cannot vote
                </button>
              ) : (
                <button
                  className="vote-button"
                  onClick={() => vote(candidate)}
                  disabled={votingId === candidate._id}
                >
                  {votingId === candidate._id
                    ? "Recording..."
                    : "Vote for Candidate"}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


/* ================= RESULTS ================= */

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/candidate/vote/count`)
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalVotes = results.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <main className="page">
      <section className="page-header">
        <span>LIVE RESULTS</span>
        <h1>Election results</h1>
        <p>
          Current vote counts from the voting system.
        </p>
      </section>

      <div className="results-summary">
        <div>
          <span>Total Votes</span>
          <strong>{totalVotes}</strong>
        </div>

        <div>
          <span>Candidates</span>
          <strong>{results.length}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong className="active-text">LIVE</strong>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading results...</div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <BarChart3 size={45} />
          <h2>No results yet</h2>
          <p>No candidates have been added yet.</p>
        </div>
      ) : (
        <div className="results-list">
          {results.map((item, index) => {
            const percentage =
              totalVotes > 0
                ? Math.round((item.count / totalVotes) * 100)
                : 0;

            return (
              <div className="result-card" key={index}>
                <div className="result-rank">
                  #{index + 1}
                </div>

                <div className="result-info">
                  <h3>{item.party}</h3>

                  <div className="result-bar">
                    <span
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="result-votes">
                  <strong>{item.count}</strong>
                  <span>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}


/* ================= PROFILE ================= */

function ProfilePage({ user }) {
  return (
    <main className="page">
      <section className="page-header">
        <span>MY ACCOUNT</span>
        <h1>Your profile</h1>
        <p>Your registered voter information.</p>
      </section>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">
          <h2>{user.name}</h2>

          <span className="role-badge">
            {user.role}
          </span>

          <div className="profile-grid">
            <div>
              <span>Age</span>
              <strong>{user.age}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{user.email || "Not provided"}</strong>
            </div>

            <div>
              <span>Mobile</span>
              <strong>{user.mobile || "Not provided"}</strong>
            </div>

            <div>
              <span>Voting Status</span>
              <strong>
                {user.isVoted ? "Vote Submitted" : "Not Voted"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


/* ================= ADMIN ================= */

function AdminPage({ token }) {
  const [candidates, setCandidates] = useState([]);

  const [form, setForm] = useState({
    name: "",
    party: "",
    age: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadCandidates = async () => {
    try {
      const response = await fetch(`${API}/candidate/`);
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const addCandidate = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(`${API}/candidate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          party: form.party,
          age: Number(form.age),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to add candidate");
        return;
      }

      setMessage("Candidate added successfully.");

      setForm({
        name: "",
        party: "",
        age: "",
      });

      loadCandidates();

    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  const deleteCandidate = async (id) => {
    const response = await fetch(
      `${API}/candidate/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      loadCandidates();
      setMessage("Candidate deleted successfully.");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <span>ADMINISTRATION</span>
        <h1>Election dashboard</h1>
        <p>Manage candidates and monitor the election.</p>
      </section>

      <div className="admin-grid">

        <div className="admin-form-card">
          <div className="admin-title">
            <div className="feature-icon">
              <Plus size={20} />
            </div>

            <div>
              <h2>Add Candidate</h2>
              <p>Create a new election candidate.</p>
            </div>
          </div>

          <form onSubmit={addCandidate} className="auth-form">

            <label>Candidate Name</label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />

            <label>Party</label>

            <input
              value={form.party}
              onChange={(e) =>
                setForm({
                  ...form,
                  party: e.target.value,
                })
              }
              required
            />

            <label>Age</label>

            <input
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value,
                })
              }
              required
            />

            <button className="primary-button full">
              <Plus size={18} />
              Add Candidate
            </button>

            {message && (
              <div className="success-message">
                <CheckCircle2 size={17} />
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="admin-list-card">
          <div className="admin-title">
            <div className="feature-icon">
              <Users size={20} />
            </div>

            <div>
              <h2>Candidates</h2>
              <p>Manage registered candidates.</p>
            </div>
          </div>

          {candidates.length === 0 ? (
            <div className="admin-empty">
              No candidates found.
            </div>
          ) : (
            candidates.map((candidate, index) => (
              <div
                className="admin-candidate"
                key={candidate._id || index}
              >
                <div className="admin-candidate-avatar">
                  {candidate.name?.charAt(0)}
                </div>

                <div>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.party}</span>
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteCandidate(candidate._id)
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}

export default App;