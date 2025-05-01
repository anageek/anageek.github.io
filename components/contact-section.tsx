"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would implement the actual email sending functionality
    // For example, using a server action or API route

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <section id="contact" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Contact Me</h2>

        <div className="max-w-2xl mx-auto border border-zinc-800 p-6 md:p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 border border-[#0099ff] mr-4">
              <Mail className="h-6 w-6 text-[#0099ff]" />
            </div>
            <h3 className="text-xl font-semibold">Send me a message</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-zinc-700 focus:border-[#0099ff] focus:ring-[#0099ff]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Your Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-zinc-700 focus:border-[#0099ff] focus:ring-[#0099ff]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="bg-transparent border-zinc-700 focus:border-[#0099ff] focus:ring-[#0099ff]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-transparent border-zinc-700 focus:border-[#0099ff] focus:ring-[#0099ff]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#0099ff] hover:bg-[#007acc] border-0" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {submitted && (
            <div className="mt-6 p-4 border border-[#0099ff] text-[#0099ff]">
              <p className="text-center">Thank you for viewing my portfolio! I'll get back to you soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
