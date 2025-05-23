"use client"

import type React from "react"
import { Download, Instagram, Youtube, Twitch, Linkedin } from "lucide-react"
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
    <section id="contact" className="relative bg-cover bg-center  w-full pt-40"  style={{ background: "url('/images/profile/bg06.png')", backgroundRepeat: "no-repeat",backgroundSize: "cover", backgroundColor: "#00254a" }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-black">Contact Me</h2>

        <div className="max-w-2xl mx-auto ">
          <div className="flex justify-center">
            <div className="inline-flex items-center mb-8 bg-blue-600/20 rounded-full">
              <div className="p-3 border rounded-full border-[#ffffff] mr-4">
                <Mail className="h-6 w-6 text-[#ffffff]" />
              </div>
              <h3 className="text-xl mr-4 font-sans font-semibold text-gray-700">alcneiva@gmail.com</h3>
            </div>
          </div>


            <div className="flex justify-center space-x-6 ">
              <a
                href="https://www.linkedin.com/in/anageek/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-950 hover:text-[#2a4d99] transition-colors "
              >
                <Linkedin className="h-5 w-5"/>
                <span className="sr-only">Linkedin</span>
              </a>
              <a
                href="https://www.instagram.com/ana.geek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-950 hover:text-[#2a4d99] transition-colors "
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/AnaGeek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-950 hover:text-[#2a4d99] transition-colors "
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
              <a
                href="https://www.twitch.tv/ana_geek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-950 hover:text-[#2a4d99] transition-colors "
              >
                <Twitch className="h-5 w-5" />
                <span className="sr-only">Twitch</span>
              </a>
            </div>
        </div>
      </div>
      <div className="text-center mt-8">        
        <p className="inline-block rounded-full border  mr-15 border-zinc-500 px-16 py-4 text-gray-800 bg-black/20  bg-blend-">Thank you for viewing my portfolio!</p>
      </div>
      <footer className=" py-6 text-center text-gray-900 font-sans font-extralight"> 
        <p>© {new Date().getFullYear()} by Ana Neiva. All rights reserved.</p>
      </footer>
    </section>
  )
}
