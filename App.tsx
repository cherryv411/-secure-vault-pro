import React, { useState, useRef } from 'react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

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
      alert("Error: Email or Mobile Number is already registered in our system.");
      return;
    }
    
    KeyVault.saveUser(data);
    alert("Account registered successfully!");
    setView('login');
  };

  const startFaceScan = async () => {
    setView('face');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = s;
      setTimeout(() => { setIsAuthenticated(true); s.getTracks().forEach(t => t.stop()); }, 3000);
    } catch { alert("Camera access denied."); setView('mfa'); }
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
                  <option value="sms">SMS OTP</option>
                  <option value="email">Email OTP</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">Sign Up</button>
                <button type="button" onClick={() => setView('login')} className="w-full text-slate-500 text-sm">Back to Login</button>
              </form>
            ) : view === 'mfa' ? (
              <div className="text-center space-y-4">
                <h2 className="font-bold">Verify via {userProfile?.mfaMethod?.toUpperCase()}</h2>
                <button onClick={() => userProfile.mfaMethod === 'face' ? startFaceScan() : setView('otp')} className="w-full bg-indigo-600 text-white py-3 rounded-lg">Proceed</button>
              </div>
            ) : view === 'face' ? (
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black h-48" />
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4">
                <input maxLength={6} className="w-full p-3 border text-center text-2xl" placeholder="Enter Code" required />
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg">Verify</button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4">Vault</h1>
          <div className="grid grid-cols-2 gap-3">
            {ALL_CATEGORIES.map(item => <div key={item} className="bg-white p-4 rounded shadow text-sm">{item}</div>)}
          </div>
        </main>
      )}
    </div>
  );
}
