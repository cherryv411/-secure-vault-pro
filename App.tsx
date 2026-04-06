import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const KeyVault = {
  users: [] as any[],
  saveUser: (user: any) => { KeyVault.users.push(user); },
  findUser: (username: string, password: string) => 
    KeyVault.users.find(u => u.username === username && u.password === password),
  isDuplicate: (email: string, mobile: string) => 
    KeyVault.users.some(u => u.email === email || u.mobile === mobile)
};

const ALL_CATEGORIES = [
  'Logins', 'Credit Cards', 'Documents', 'Secure Notes', 'API Credentials', 
  'Bank Accounts', 'Crypto Wallets', 'Databases', 'Driving Licenses', 
  'Emails', 'Medical Records', 'Memberships', 'Outdoor Licenses', 
  'Passports', 'Rewards', 'SSH Keys', 'Servers', 'Social Security Numbers', 
  'Software Licenses', 'Wireless Routers'
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'login' | 'signup' | 'mfa' | 'face' | 'otp'>('login');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [load, setLoad] = useState(45);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setLoad(prev => Math.min(100, Math.max(20, prev + (Math.random() * 20 - 10))));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = e.currentTarget;
    const user = KeyVault.findUser(username.value, password.value);
    if (!user) {
      alert("Invalid credentials or user not found. Please register.");
      setView('signup');
    } else {
      setUserProfile(user);
      setView('mfa');
    }
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (KeyVault.isDuplicate(data.email as string, data.mobile as string)) {
      alert("Error: Email or Mobile Number is already registered.");
      return;
    }
    KeyVault.saveUser(data);
    alert("Account registered successfully!");
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
            {view === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-xl font-bold text-indigo-900">SecureVault Login</h2>
                <input name="username" placeholder="Username" className="w-full p-3 border rounded-lg" required />
                <input name="password" type="password" placeholder="Master Password" className="w-full p-3 border rounded-lg" required />
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">Login</button>
                <button type="button" onClick={() => setView('signup')} className="w-full text-indigo-600 text-sm font-bold">Create Account</button>
              </form>
            ) : view === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-3">
                <h2 className="text-xl font-bold text-indigo-900">Register</h2>
                <input name="firstName" placeholder="First Name" className="w-full p-2 border rounded-lg" required />
                <input name="middleName" placeholder="Middle Name (Optional)" className="w-full p-2 border rounded-lg" />
                <input name="lastName" placeholder="Last Name" className="w-full p-2 border rounded-lg" required />
                <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded-lg" required />
                <input name="mobile" type="tel" placeholder="Mobile Number" className="w-full p-2 border rounded-lg" required />
                <input name="username" placeholder="Username" className="w-full p-2 border rounded-lg" required />
                <input name="password" type="password" placeholder="Master Password" className="w-full p-2 border rounded-lg" required />
                <select name="mfaMethod" className="w-full p-2 border rounded-lg">
                  <option value="otp">Authenticator App</option>
                  <option value="face">Face Recognition</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">Sign Up</button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="font-bold">Verify Identity</h2>
                <button onClick={() => setIsAuthenticated(true)} className="w-full bg-indigo-600 text-white py-3 rounded-lg">Proceed</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <main className="p-6 space-y-8">
          <section>
            <h1 className="text-2xl font-bold mb-4">Public-Facing Load Balancer</h1>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-700">Global Traffic Distribution</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${load > 80 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {load > 80 ? 'SCALING ACTIVE' : 'HEALTHY'}
                </span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ load }, { load: load + 5 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="load" stroke="#4f46e5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Vault Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ALL_CATEGORIES.map(item => <div key={item} className="bg-white p-4 rounded shadow text-sm">{item}</div>)}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
