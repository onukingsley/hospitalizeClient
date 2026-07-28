import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  HeartPulse, Shield, UserPlus, Stethoscope, FlaskConical,
  Pill, Syringe, Banknote, FileText, User
} from 'lucide-react';
import {userStore} from "../../store/store.jsx";
import axiosClient from "../../service/axiosClient.js";

const roleIcons = {
  admin: <Shield className="w-6 h-6" />,
  clerk: <UserPlus className="w-6 h-6" />,
  doctor: <Stethoscope className="w-6 h-6" />,
  lab: <FlaskConical className="w-6 h-6" />,
  pharmacy: <Pill className="w-6 h-6" />,
  nurse: <Syringe className="w-6 h-6" />,
  finance: <Banknote className="w-6 h-6" />,
  secretary: <FileText className="w-6 h-6" />,
  patient: <User className="w-6 h-6" />,
};

const roles = ['admin', 'clerk', 'doctor', 'lab', 'pharmacy', 'nurse', 'accountant', 'secretary', 'patient'];
//const roles = ['admin', 'clerk', 'doctor', 'lab', 'pharmacy', 'nurse', 'finance', 'secretary', 'patient'];

const LoginPage = () => {

  const navigate = useNavigate();
  const { setUser } = userStore();



  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      'details' : username,
      'password' : password,
    }
    setIsLoading(true)
    axiosClient.post('/login',payload)
        .then(({data})=>{
          if (data.message == 'Login Successful'){
            setUser(data.user, data.token)

            navigate(`/${data.user.user_role}`);
          }else {
            setError(data.message)
          }

          setIsLoading(false);
        }).catch((e)=> {
          setError(e.message)
          setIsLoading(false)
    })

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div className="hidden lg:flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <HeartPulse className="w-14 h-14 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Hospitalise</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Comprehensive Hospital Management System designed for modern African healthcare facilities.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {[
              { icon: <Stethoscope className="w-5 h-5" />, label: 'Clinical Care' },
              { icon: <FlaskConical className="w-5 h-5" />, label: 'Laboratory' },
              { icon: <Pill className="w-5 h-5" />, label: 'Pharmacy' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border shadow-sm">
                <div className="text-primary">{item.icon}</div>
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Streamline operations from registration to recovery
          </p>
        </div>

        {/* Right Side - Login Form */}
        <Card className="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <div className="lg:hidden flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-3">
              <HeartPulse className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Hospitalise</h1>
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">Sign In to Your Account</h2>
          {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
                {error}
              </div>
          )}

          {/* Role Selection */}


          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm">Credential</Label>
              <Input
                id="username"
                placeholder="Enter username, email, RegId"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Any username/password works for demo</p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={ isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                `Sign in `
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-primary hover:underline"
            >
              Back to Homepage
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
