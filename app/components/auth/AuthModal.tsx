'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth, ApiClientError } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useToast } from '@/app/components/ui/Toast';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultMode?: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen: isOpenProp, onClose: onCloseProp, defaultMode = 'login' }) => {
  const { login, register, openUserMenu } = useAuth();
  const { loginOpen, registerOpen, closeAll, switchToLogin, switchToRegister } = useUI();
  const { showToast } = useToast();

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isControlled = isOpenProp !== undefined;
  const isActuallyOpen = isControlled ? isOpenProp : loginOpen || registerOpen;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const touch = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const resetRegisterValidation = () => {
    setSubmitAttempted(false);
    setTouched({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const prevOpen = useRef(isActuallyOpen);
  useEffect(() => {
    const justOpened = isActuallyOpen && !prevOpen.current;
    prevOpen.current = isActuallyOpen;

    if (justOpened) {
      if (!isControlled) {
        setMode(registerOpen ? 'register' : 'login');
      } else {
        setMode(defaultMode);
      }
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setShowPassword(false);
      setError(null);
      setIsSubmitting(false);
      resetRegisterValidation();
    }
  }, [isActuallyOpen, registerOpen, isControlled, defaultMode]);

  const handleClose = useCallback(() => {
    if (isControlled && onCloseProp) onCloseProp();
    else closeAll();
  }, [isControlled, onCloseProp, closeAll]);

  const handleSwitchMode = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setPassword('');
    setConfirmPassword('');
    setError(null);
    resetRegisterValidation();
    if (!isControlled) {
      if (newMode === 'login') switchToLogin();
      else switchToRegister();
    }
  }, [isControlled, switchToLogin, switchToRegister]);

  useLockBodyScroll(isActuallyOpen && isMobile);

  if (!isActuallyOpen) return null;

  const isLoginValid = email.trim() !== '' && password.trim() !== '';

  const hasDigits = (value: string) => /\d/.test(value);
  const isValidName = (value: string) => value.trim() !== '' && !hasDigits(value.trim());
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isValidPassword = (value: string) => value.length >= 8;
  const passwordsMatch = password === confirmPassword;

  const shouldShowFieldError = (field: keyof typeof touched) =>
    touched[field] || submitAttempted;

  const getFirstNameError = (): string | null => {
    if (!shouldShowFieldError('firstName')) return null;
    if (firstName.trim() === '') return 'Le prénom est requis.';
    if (hasDigits(firstName)) return 'Le prénom ne peut pas contenir de chiffres.';
    return null;
  };

  const getLastNameError = (): string | null => {
    if (!shouldShowFieldError('lastName')) return null;
    if (lastName.trim() === '') return 'Le nom est requis.';
    if (hasDigits(lastName)) return 'Le nom ne peut pas contenir de chiffres.';
    return null;
  };

  const getEmailError = (): string | null => {
    if (!shouldShowFieldError('email')) return null;
    if (email.trim() === '') return "L'adresse e-mail est requise.";
    if (!isValidEmail(email)) return 'Adresse e-mail invalide.';
    return null;
  };

  const getPasswordError = (): string | null => {
    if (!shouldShowFieldError('password')) return null;
    if (password === '') return 'Le mot de passe est requis.';
    if (!isValidPassword(password)) return 'Le mot de passe doit contenir au moins 8 caractères.';
    return null;
  };

  const getConfirmPasswordError = (): string | null => {
    if (!shouldShowFieldError('confirmPassword')) return null;
    if (confirmPassword === '') return 'Veuillez confirmer votre mot de passe.';
    if (!passwordsMatch) return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const isRegisterValid =
    isValidName(firstName) &&
    isValidName(lastName) &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    passwordsMatch &&
    confirmPassword !== '';

  const fieldErrorClass = 'text-xs text-red-500 mt-1';

  const FieldError = ({ message }: { message: string | null }) =>
    message ? <p className={fieldErrorClass}>{message}</p> : null;

  const handleAuthSuccess = (first_name: string) => {
    handleClose();
    showToast(`Bonjour ${first_name} !`);
    if (isMobile) openUserMenu();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginValid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const loggedInUser = await login(email.trim(), password);
      handleAuthSuccess(loggedInUser.first_name);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(
          err.code === 'INVALID_CREDENTIALS'
            ? 'Adresse e-mail ou mot de passe incorrect.'
            : err.message,
        );
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (!isRegisterValid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const newUser = await register({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      handleAuthSuccess(newUser.first_name);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(
          err.code === 'EMAIL_ALREADY_EXISTS'
            ? 'Cette adresse e-mail est déjà utilisée.'
            : err.message,
        );
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-sm px-4 py-3 text-sm outline-none transition-colors focus:border-black';
  const labelClass = 'block text-sm text-gray-700 mb-1.5';

  const errorBanner = error ? (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
      {error}
    </div>
  ) : null;

  const loginForm = (
    <form onSubmit={handleLoginSubmit}>
      <h2 className="font-serif text-3xl text-center mb-8">Se connecter</h2>
      <div className="space-y-5">
        {errorBanner}
        <div>
          <label className={labelClass}>Adresse e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <label className={labelClass}>Mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-10`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-black transition-colors"
          >
            Vous avez oublié votre mot de passe ?
          </button>
        </div>

        <button
          type="submit"
          disabled={!isLoginValid || isSubmitting}
          className={`w-full py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            isLoginValid && !isSubmitting
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-white cursor-not-allowed'
          }`}
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          Se connecter
        </button>

        <p className="text-center text-xs text-gray-500">
          Nouveau sur le site ?{' '}
          <button
            type="button"
            onClick={() => handleSwitchMode('register')}
            className="text-gray-800 hover:text-black transition-colors"
          >
            S&apos;inscrire
          </button>
        </p>
      </div>
    </form>
  );

  const registerForm = (
    <form onSubmit={handleRegisterSubmit}>
      <h2 className="font-serif text-3xl text-center mb-8">S&apos;inscrire</h2>
      <div className="space-y-5">
        {errorBanner}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => touch('firstName')}
              className={inputClass}
              autoComplete="given-name"
            />
            <FieldError message={getFirstNameError()} />
          </div>
          <div>
            <label className={labelClass}>Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => touch('lastName')}
              className={inputClass}
              autoComplete="family-name"
            />
            <FieldError message={getLastNameError()} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Adresse e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => touch('email')}
            className={inputClass}
            autoComplete="email"
          />
          <FieldError message={getEmailError()} />
        </div>

        <div className="relative">
          <label className={labelClass}>Mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => touch('password')}
            className={`${inputClass} pr-10`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <FieldError message={getPasswordError()} />
        </div>

        <div className="relative">
          <label className={labelClass}>Confirmer le mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => touch('confirmPassword')}
            className={`${inputClass} pr-10`}
            autoComplete="new-password"
          />
          <FieldError message={getConfirmPasswordError()} />
        </div>

        <button
          type="submit"
          disabled={!isRegisterValid || isSubmitting}
          className={`w-full py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            isRegisterValid && !isSubmitting
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-white cursor-not-allowed'
          }`}
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          S&apos;inscrire
        </button>

        <p className="text-center text-xs text-gray-500">
          Déjà un compte ?{' '}
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className="text-gray-800 hover:text-black transition-colors"
          >
            Se connecter
          </button>
        </p>
      </div>
    </form>
  );

  if (!isMobile) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[500px] bg-white rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-end px-5 pt-5">
            <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="px-12 pb-10 pt-0">
            {mode === 'login' ? loginForm : registerForm}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-white animate-in fade-in duration-200 flex flex-col">
      <div className="flex justify-end px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
        <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {mode === 'login' ? loginForm : registerForm}
      </div>
    </div>
  );
};

export default AuthModal;
