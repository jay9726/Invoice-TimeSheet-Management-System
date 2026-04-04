import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage: React.FC = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-[10rem] font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-pink-400 select-none">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">
          Page not found
        </h2>
        <p className="text-slate-400 mt-3">
          Sorry, the page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Go home
          </button>


          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Go back
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <span className="h-px w-24 bg-slate-700" />
          <span className="mx-4 text-xs uppercase tracking-widest text-slate-500">
            Error
          </span>
          <span className="h-px w-24 bg-slate-700" />
        </div>
      </div>
    </div>
  )
}

export default ErrorPage