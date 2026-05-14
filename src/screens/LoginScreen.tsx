import { useAuth } from '../hooks/useAuth';

export function LoginScreen() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen px-6 text-center">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Reslot</h1>
        <p className="text-gray-400">AI destekli dinamik slot piyasasına hoş geldiniz.</p>
      </div>

      <button
        onClick={loginWithGoogle}
        className="flex items-center gap-3 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        Google ile Giriş Yap
      </button>
    </div>
  );
}
