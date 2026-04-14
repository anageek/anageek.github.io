'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Loader2, Link as LinkIcon, PlaySquare } from 'lucide-react'
import { toast } from 'sonner'
import { updateSiteConfig } from '@/features/site-config'

interface SettingsFormProps {
  initialConfig: Record<string, string>
}

export function SettingsForm({ initialConfig }: SettingsFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialConfig.heroVideoUrl ?? '')

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateSiteConfig('heroVideoUrl', heroVideoUrl)
      if (result && result.success) {
        toast.success('Settings saved successfully!')
        router.refresh()
      } else {
        toast.error('Failed to save settings')
      }
    } catch {
      toast.error('Error occurred while saving')
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
              className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[9px] uppercase tracking-widest font-black px-2 py-0.5"
            >
              Site Settings
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">General Configuration</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage core settings and global sections of your portfolio.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4 text-zinc-100">
          <PlaySquare className="w-5 h-5 text-blue-500" />
          Landing Page Hero
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,400px)] gap-10">
          <div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  YouTube Embed URL
                </Label>
                <div className="flex items-center h-12 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
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
                  Use the &apos;Embed&apos; link format from YouTube (e.g. includes{' '}
                  <code className="text-zinc-400">/embed/ID</code>) and preferably append URL
                  parameters like{' '}
                  <code className="text-zinc-400">?autoplay=1&mute=1&loop=1</code> for the best
                  hero experience.
                </p>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-8 h-12 rounded-xl shadow-xl shadow-blue-600/20"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">
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
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/80 pointer-events-none">
                Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
