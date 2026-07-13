import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { toast } from 'sonner';
import { faqs } from '@/data/products';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@seoulspice.com',
    href: 'mailto:hello@seoulspice.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Seoul Street, New York, NY 10001',
    href: '#',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon - Fri: 9AM - 6PM EST',
    href: '#',
  },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#A8DADC]/20 via-[#F8F9FA] to-[#F4A261]/10">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
              Get in Touch
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1D3557] mt-4 mb-6">
              We'd Love to Hear From You
            </h1>
            <p className="text-lg text-[#6C757D] max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hello? We're here to help and always happy to chat.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D3557] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D3557] mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6 mb-8">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 bg-[#A8DADC]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#A8DADC]/30 transition-colors">
                        <item.icon className="w-5 h-5 text-[#A8DADC]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#6C757D] mb-1">{item.label}</p>
                        <p className="text-[#1D3557] font-medium group-hover:text-[#F4A261] transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-sm text-[#6C757D] mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="w-12 h-12 bg-[#F8F9FA] rounded-xl flex items-center justify-center hover:bg-[#A8DADC]/20 transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5 text-[#1D3557]" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-8 aspect-video bg-[#F8F9FA] rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#A8DADC] mx-auto mb-3" />
                    <p className="text-[#6C757D]">Map View</p>
                    <p className="text-sm text-[#6C757D]/70">123 Seoul Street, New York</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-24 bg-[#F8F9FA]">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                Got Questions?
              </span>
              <h2 className="text-3xl font-bold text-[#1D3557] mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="bg-white rounded-xl border-none px-6"
                >
                  <AccordionTrigger className="text-left text-[#1D3557] font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#6C757D] pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-[#1D3557] rounded-3xl overflow-hidden p-8 lg:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A8DADC]/20 to-[#F4A261]/20" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Shop?
                </h2>
                <p className="text-white/70 mb-8">
                  Explore our curated collections and find something special for yourself or a loved one.
                </p>
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#A8DADC] text-[#1D3557] font-medium rounded-full hover:bg-[#F4A261] hover:text-white transition-colors"
                >
                  Browse Products
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
