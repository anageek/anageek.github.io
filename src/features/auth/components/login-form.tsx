'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { loginAction } from '@/features/auth'
import { loginSchema } from '@/features/auth'
import type { LoginFormValues } from '@/features/auth'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const result = await loginAction(values)
      if (result && 'error' in result) {
        setError(result.error ?? 'Credenciais inválidas')
      }
    } catch {
      setError('Algo deu errado. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-zinc-950 to-zinc-950">
      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-white tracking-tight">
            Admin Portal
          </CardTitle>
          <p className="text-zinc-500 text-center text-sm">
            Entre com suas credenciais para gerenciar o portfólio
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 font-medium">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@anageek.me"
                  {...register('email')}
                  className={`pl-10 bg-zinc-950/50 border-zinc-800 text-white focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.email ? 'border-red-500/50' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                title="Password"
                className="text-zinc-400 font-medium text-sm"
              >
                Senha
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`pl-10 pr-10 bg-zinc-950/50 border-zinc-800 text-white focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.password ? 'border-red-500/50' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-zinc-600 text-[10px] text-center uppercase tracking-widest font-bold">
            Arkion Systems &copy; 2024
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
