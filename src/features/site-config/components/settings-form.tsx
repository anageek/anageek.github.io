'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Loader2, Link as LinkIcon, PlaySquare, Type, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { updateSiteConfig } from '@/features/site-config'
import { cn } from '@/lib/utils'

const FONT_PRESETS = [
  { name: 'Space Grotesk', label: 'Space Grotesk', note: 'Atual' },
  { name: 'Inter', label: 'Inter', note: 'Clean' },
  { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', note: 'Modern' },
  { name: 'DM Sans', label: 'DM Sans', note: 'Minimalista' },
  { name: 'Sora', label: 'Sora', note: 'Tech' },
  { name: 'Nunito', label: 'Nunito', note: 'Suave' },
  { name: 'Poppins', label: 'Poppins', note: 'Popular' },
  { name: 'Raleway', label: 'Raleway', note: 'Elegante' },
  { name: 'Montserrat', label: 'Montserrat', note: 'Bold' },
  { name: 'Bebas Neue', label: 'Bebas Neue', note: 'Display' },
]

interface SettingsFormProps {
  initialConfig: Record<string, string>
}

export function SettingsForm({ initialConfig }: SettingsFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialConfig.heroVideoUrl ?? '')
  const [titleGlitch, setTitleGlitch] = useState(initialConfig.titleGlitch === 'true')
  // '' means "use default Space Grotesk" (no custom font stored)
  const [siteFont, setSiteFont] = useState(initialConfig.siteFont ?? '')
  const [customFont, setCustomFont] = useState(
    FONT_PRESETS.some((f) => f.name === (initialConfig.siteFont ?? ''))
      ? ''
      : (initialConfig.siteFont ?? ''),
  )

  const selectedPreset = FONT_PRESETS.find((f) => f.name === siteFont)
  const isCustom = siteFont !== '' && !selectedPreset

  // Load font dynamically for the live preview inside the form
  useEffect(() => {
    if (!siteFont) return
    const existing = document.getElementById('gf-preview')
    if (existing) existing.remove()
    const link = document.createElement('link')
    link.id = 'gf-preview'
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(siteFont)}:wght@300;400;500;600;700;800&display=swap`
    document.head.appendChild(link)
    return () => { link.remove() }
  }, [siteFont])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSiteConfig('heroVideoUrl', heroVideoUrl)
      await updateSiteConfig('siteFont', siteFont)
      await updateSiteConfig('titleGlitch', titleGlitch ? 'true' : 'false')
      toast.success('Configurações salvas!')
      router.refresh()
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="border-primary/20 text-primary bg-primary/5 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5"
            >
              Site Settings
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tighter">General Configuration</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage core settings and global sections of your portfolio.
          </p>
        </div>
      </div>

      {/* ── Hero Video ──────────────────────────────────────── */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-8 backdrop-blur-3xl shadow-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4 text-zinc-100">
          <PlaySquare className="w-5 h-5 text-primary" />
          Landing Page Hero
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,400px)] gap-10">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              YouTube Embed URL
            </Label>
            <div className="flex items-center h-12 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
              <div className="px-4 border-r border-zinc-800 text-zinc-600">
                <LinkIcon className="w-4 h-4" />
              </div>
              <Input
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="flex-1 bg-transparent border-0 text-sm text-zinc-300 h-full focus-visible:ring-0 px-4"
              />
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Use o formato Embed do YouTube (<code className="text-zinc-400">/embed/ID</code>) com parâmetros{' '}
              <code className="text-zinc-400">?autoplay=1&amp;mute=1&amp;loop=1</code>.
            </p>
          </div>

          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
              Live Preview
            </Label>
            <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-black/50 shadow-xl relative">
              {heroVideoUrl ? (
                <iframe
                  className="w-full h-full"
                  src={heroVideoUrl}
                  title="Hero Trailer Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                  <PlaySquare className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium">No Video Configured</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80 pointer-events-none">
                Preview
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Typography ────────────────────────────────────────── */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-8 backdrop-blur-3xl shadow-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4 text-zinc-100">
          <Type className="w-5 h-5 text-primary" />
          Tipografia do Sistema
        </h2>

        <div className="space-y-6">
          {/* Presets */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">
              Fontes Disponíveis (Google Fonts)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {/* Default option */}
              <button
                type="button"
                onClick={() => { setSiteFont(''); setCustomFont('') }}
                className={cn(
                  'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
                  siteFont === ''
                    ? 'bg-primary/10 border-primary/40 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white',
                )}
              >
                {siteFont === '' && <Check className="w-3 h-3 text-primary mb-1" />}
                <span className="text-xs font-semibold">Padrão</span>
                <span className="text-[10px] text-zinc-600">Space Grotesk</span>
              </button>

              {FONT_PRESETS.slice(1).map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => { setSiteFont(font.name); setCustomFont('') }}
                  className={cn(
                    'flex flex-col items-start p-3 rounded-xl border text-left transition-all',
                    siteFont === font.name
                      ? 'bg-primary/10 border-primary/40 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white',
                  )}
                >
                  {siteFont === font.name && <Check className="w-3 h-3 text-primary mb-1" />}
                  <span className="text-xs font-semibold">{font.label}</span>
                  <span className="text-[10px] text-zinc-600">{font.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom font */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
              Fonte Personalizada (Google Fonts)
            </Label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center h-12 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                <div className="px-4 border-r border-zinc-800 text-zinc-600">
                  <Type className="w-4 h-4" />
                </div>
                <Input
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  placeholder="Ex: Outfit, Figtree, Nunito Sans..."
                  className="flex-1 bg-transparent border-0 text-sm text-zinc-300 h-full focus-visible:ring-0 px-4"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!customFont.trim()}
                onClick={() => {
                  const name = customFont.trim()
                  if (name) { setSiteFont(name) }
                }}
                className="h-12 px-5 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 bg-zinc-950"
              >
                Aplicar
              </Button>
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Digite o nome exato da fonte no{' '}
              <a
                href="https://fonts.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Fonts
              </a>
              . A fonte será carregada automaticamente.
            </p>
          </div>

          {/* Preview */}
          {siteFont && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Preview — {siteFont}
              </p>
              <p
                className="text-2xl text-white"
                style={{ fontFamily: `'${siteFont}', system-ui, sans-serif` }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <p
                className="text-sm text-zinc-400 mt-1"
                style={{ fontFamily: `'${siteFont}', system-ui, sans-serif` }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Interface / Animações ─────────────────────────────────────── */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-8 backdrop-blur-3xl shadow-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4 text-zinc-100">
          <Sparkles className="w-5 h-5 text-primary" />
          Animações de Interface
        </h2>

        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-white">Efeito Glitch nos Títulos</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Animação ASCII ripple nos títulos da página pública (nome, "Contact", etc.)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTitleGlitch((v) => !v)}
            className={cn(
              'relative w-11 h-6 rounded-full border transition-all duration-200 shrink-0',
              titleGlitch
                ? 'bg-primary border-primary'
                : 'bg-zinc-800 border-zinc-700',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200',
                titleGlitch ? 'left-[22px]' : 'left-0.5',
              )}
            />
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-medium text-xs uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
