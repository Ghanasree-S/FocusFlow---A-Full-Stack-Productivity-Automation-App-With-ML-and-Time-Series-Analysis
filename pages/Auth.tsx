import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, ChevronRight, Check, Activity, Clock, Shield } from 'lucide-react';
import { Button, Card } from '../components/UI';

// 🔥 IMPORT API CALLS (ADDED)
import { loginUser, signupUser } from "../api/auth";


// ------------------------------------------------------------
// LOGIN PAGE
// ------------------------------------------------------------
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser(email, password);   // 🔥 BACKEND CALL

      localStorage.setItem("ff_token", res.token);    // store JWT
      navigate('/');                                  // redirect to dashboard

    } catch (err: any) {
      alert(err.response?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to FocusFlow
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or <Link to="/signup" className="font-medium text-primary hover:text-sky-500">start your 14-day free trial</Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-slate-700">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700 dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700 dark:text-white sm:text-sm"
              />
            </div>

            <Button type="submit" className="w-full">Sign in</Button>

          </form>

        </div>
      </div>
    </div>
  );
};




// ------------------------------------------------------------
// SIGNUP PAGE
// ------------------------------------------------------------
export const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [goal,     setGoal]     = useState("Balance Work & Life");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signupUser(fullName, email, password, goal);  // 🔥 BACKEND CALL

      navigate('/onboarding');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="font-medium text-primary">Sign in</Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-slate-700">
          
          <form className="space-y-6" onSubmit={handleSignup}>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Productivity Goal</label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:text-white"
              >
                <option>Balance Work & Life</option>
                <option>Deep Focus / Research</option>
                <option>Team Management</option>
              </select>
            </div>

            <Button type="submit" className="w-full">Create Account</Button>

          </form>

        </div>
      </div>
    </div>
  );
};




// ------------------------------------------------------------
// ONBOARDING PAGE (NO CHANGES REQUIRED — UI ONLY)
// ------------------------------------------------------------
export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to FocusFlow</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              FocusFlow uses intelligent machine learning to analyze your productivity patterns...
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Choose Your Style</h2>
            <p className="text-center text-gray-500 mb-6">How do you prefer to work?</p>

            <div className="grid gap-4">
              {['Balanced (Pomodoro mixed with breaks)', 
                'High-Focus (Deep work sessions)', 
                'Flexible (Flow state driven)'].map((opt, idx) => (
                <button key={idx} className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-all dark:border-slate-600 dark:text-gray-200">
                  <span className="font-semibold block">{opt.split('(')[0]}</span>
                  <span className="text-sm text-gray-500">{opt.split('(')[1].replace(')', '')}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Activity className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tracking Permissions</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              To provide ML insights, FocusFlow needs to track app usage...
            </p>
            <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg text-left text-sm space-y-2 mb-4">
              <div className="flex items-center"><Check size={16} className="text-green-500 mr-2"/> Screen Time Monitoring</div>
              <div className="flex items-center"><Check size={16} className="text-green-500 mr-2"/> Active App Detection</div>
              <div className="flex items-center"><Shield size={16} className="text-green-500 mr-2"/> Privacy First</div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
             <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Setup Daily Hours</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Time</label>
                <input type="time" defaultValue="09:00" className="block w-full border rounded-md p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">End Time</label>
                <input type="time" defaultValue="17:00" className="block w-full border rounded-md p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">

        <div className="mb-8">
           <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-300 ease-out"
               style={{ width: `${(step / 4) * 100}%` }}
             />
           </div>
        </div>
        
        <div className="mb-10 min-h-[300px] flex flex-col justify-center">
          {renderStep()}
        </div>

        <div className="flex justify-between items-center">
          {step > 1 ? (
             <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
          ) : <div></div>}
          
          <Button onClick={handleNext} className="ml-auto">
            {step === 4 ? 'Get Started' : 'Next'}
            {step !== 4 && <ChevronRight className="ml-2 w-4 h-4" />}
          </Button>
        </div>

      </div>
    </div>
  );
};
