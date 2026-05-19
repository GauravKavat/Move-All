"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, Package, Truck, CheckCircle2, Shield, Globe, MapPin, Search, BarChart3, Clock, RotateCcw, Plus, AlertCircle } from "lucide-react";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function HeroPage() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetQuote = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Our logistics experts will contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#111827] dark:text-[#ededdf] font-sans selection:bg-[#f37a2a] selection:text-white transition-colors duration-300">
      
      {/* Dynamic Frosted Glass Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "mx-4 mt-4 max-w-6xl md:mx-auto rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-xl saturate-200 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-3 px-6"
            : "bg-transparent py-6 px-8 max-w-7xl mx-auto border-transparent shadow-none"
        } flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#292F54] dark:bg-[#2b3358] text-lg font-extrabold text-white shadow-sm">
            M
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Move All</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          <Link href="#features" className="text-gray-700 hover:text-[#f37a2a] dark:text-gray-300 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-[#f37a2a] dark:text-gray-300 transition-colors">How it Works</Link>
          <Link href="#about" className="text-gray-700 hover:text-[#f37a2a] dark:text-gray-300 transition-colors">About Us</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeTogglerButton
            variant="ghost"
            className="rounded-full p-2.5 text-gray-700 dark:text-gray-300 transition hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white [&_svg]:h-5 [&_svg]:w-5 h-auto w-auto min-w-0"
          />
          
          <div className="flex items-center p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10">
            <Link href="/client" tabIndex={-1}>
              <Button variant="ghost" className="rounded-full px-6 font-semibold hover:bg-white/50 dark:hover:bg-white/10 hover:text-[#111827] dark:hover:text-white transition-colors">
                Sign In
              </Button>
            </Link>
            <Link href="/client" tabIndex={-1}>
              <Button className="rounded-full px-6 bg-[#f37a2a] hover:bg-[#e06716] text-white font-semibold shadow-md">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (Huly-Inspired) */}
      <section className="relative flex flex-col items-center justify-center pt-48 pb-20 px-6 overflow-hidden min-h-[90vh]">
        
        {/* Ambient Lighting & Glowing Spine */}
        <div className="absolute inset-0 bg-[#050505] hidden dark:block" />
        
        {/* Interactive Box-Trail Grid */}
        <div 
          className="absolute inset-0 flex flex-wrap content-start [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-auto"
        >
          {Array.from({ length: 4000 }).map((_, i) => (
            <div 
              key={i}
              className="w-[24px] h-[24px] border-r border-b border-black/[0.04] dark:border-white/[0.04] hover:bg-[#f37a2a]/15 dark:hover:bg-[#f37a2a]/40 transition-colors duration-300 hover:duration-0"
            />
          ))}
        </div>
        
        {/* The Central Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#f37a2a]/30 to-transparent" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[200px] md:w-[400px] h-[600px] bg-[#f37a2a]/20 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-80 mix-blend-screen" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[400px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none opacity-60 dark:opacity-70 mix-blend-screen" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10 pointer-events-none">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-gray-200 text-xs font-bold uppercase tracking-widest mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f37a2a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f37a2a]"></span>
            </span>
            Next-Gen Logistics
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-[90px] font-extrabold tracking-[-0.03em] leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 text-gray-900 dark:text-white">
            Deliver faster.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f37a2a] via-[#ff9b5a] to-[#f37a2a] bg-[length:200%_auto] animate-gradient drop-shadow-sm">
              Save more money.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 tracking-[-0.01em]">
            The definitive operating system for modern fulfillment. Automate your courier selection, conquer RTOs, and scale with absolute precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pointer-events-auto">
            <Link href="/client">
              <Button size="lg" className="h-14 px-10 text-lg bg-[#292F54] dark:bg-white dark:text-[#050505] hover:bg-[#1f2441] dark:hover:bg-gray-200 text-white rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all w-full sm:w-auto group">
                Enter Dashboard <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full font-bold border-gray-300 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-md hover:bg-white dark:hover:bg-white/5 shadow-sm w-full sm:w-auto transition-all">
                  Get a Free Consultation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] dark:bg-[#0c0d12] border-white/10 backdrop-blur-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight">Let&apos;s improve your shipping.</DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    Tell us about your business, and our logistics experts will help you find the best shipping strategy.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGetQuote} className="space-y-5 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Your Name</Label>
                    <Input id="name" placeholder="John Doe" required className="h-11 dark:bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@company.com" required className="h-11 dark:bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume" className="text-sm font-semibold">Monthly Orders</Label>
                    <Select required>
                      <SelectTrigger className="h-11 dark:bg-white/5 border-white/10">
                        <SelectValue placeholder="Select estimated volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">0 - 1,000</SelectItem>
                        <SelectItem value="med">1,000 - 10,000</SelectItem>
                        <SelectItem value="high">10,000 - 50,000</SelectItem>
                        <SelectItem value="enterprise">50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white mt-6 h-12 text-base font-bold rounded-lg shadow-[0_0_20px_rgba(243,122,42,0.3)]">
                    Request a Call
                  </Button>
                </form>
              </DialogContent>
              </Dialog>
            </div>

          {/* Platform Snapshots: Bento Grid */}
          <div className="pt-32 pb-20 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 relative flex justify-center max-w-6xl mx-auto z-20">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#f37a2a]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10 perspective-[2000px]">
              
              {/* Bento Box 1: Client Dashboard Mock (Large) */}
              <div className="md:col-span-2 bg-white/90 dark:bg-[#0c0d12]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex flex-col gap-6 group hover:border-[#f37a2a]/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f37a2a]/5 blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="flex justify-between items-start relative z-10">
                   <div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Client Dashboard</h3>
                     <p className="text-sm text-gray-500 mt-1">Manage orders, pickups, and billing in one place.</p>
                   </div>
                   <div className="px-3 py-1 bg-[#f37a2a]/10 text-[#f37a2a] rounded-full text-xs font-bold border border-[#f37a2a]/20">Active Workspace</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-[#16181d] rounded-2xl p-5 border border-gray-100 dark:border-white/5 flex-1 relative z-10 shadow-inner">
                   {/* KPI Cards inside */}
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-[#0c0d12] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                         <div className="flex justify-between items-center mb-3">
                           <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                             <Package className="h-4 w-4 text-blue-500" />
                           </div>
                           <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded font-bold">+12.5%</span>
                         </div>
                         <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">8,542</p>
                         <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#f37a2a]/10 to-orange-500/5 dark:from-[#f37a2a]/20 dark:to-[#f37a2a]/5 p-4 rounded-xl border border-[#f37a2a]/20 shadow-sm relative overflow-hidden">
                         <div className="flex justify-between items-center mb-3 relative z-10">
                           <div className="p-1.5 bg-white/50 dark:bg-white/10 rounded-md">
                             <RotateCcw className="h-4 w-4 text-[#f37a2a]" />
                           </div>
                           <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded font-bold">-0.5%</span>
                         </div>
                         <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">2.8%</p>
                         <p className="text-xs text-[#f37a2a] font-bold relative z-10">RTO Rate (Low)</p>
                      </div>
                      <div className="hidden md:block bg-white dark:bg-[#0c0d12] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                         <div className="flex justify-between items-center mb-3">
                           <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
                             <Truck className="h-4 w-4 text-emerald-500" />
                           </div>
                           <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded font-bold">+8.3%</span>
                         </div>
                         <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">7,823</p>
                         <p className="text-xs text-gray-500 font-medium">Shipped</p>
                      </div>
                   </div>
                   {/* Quick Action Mock */}
                   <div className="mt-5 flex gap-3">
                     <button className="flex-1 bg-[#f37a2a] hover:bg-[#e06716] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"><Plus className="h-4 w-4" /> Create Order</button>
                     <button className="flex-1 bg-white dark:bg-[#0c0d12] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors">Schedule Pickup</button>
                   </div>
                </div>
              </div>

              {/* Bento Box 2: Activity Feed */}
              <div className="bg-white/90 dark:bg-[#0c0d12]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex flex-col gap-4 group hover:border-blue-500/50 transition-colors relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/5 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="relative z-10">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Live Feed</h3>
                   <p className="text-sm text-gray-500 mt-1">Real-time platform events.</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#16181d] rounded-2xl p-5 border border-gray-100 dark:border-white/5 flex-1 flex flex-col justify-center gap-5 relative z-10 shadow-inner">
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm"><Truck className="h-3.5 w-3.5" /></div>
                     <div><p className="text-xs font-bold text-gray-900 dark:text-white">EKL-789456</p><p className="text-[10px] text-gray-500 font-medium">Out for delivery • 14:15</p></div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-sm"><AlertCircle className="h-3.5 w-3.5" /></div>
                     <div><p className="text-xs font-bold text-gray-900 dark:text-white">Exception EXC-001</p><p className="text-[10px] text-gray-500 font-medium">Address not found • 12:45</p></div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm"><Package className="h-3.5 w-3.5" /></div>
                     <div><p className="text-xs font-bold text-gray-900 dark:text-white">ORD-005 confirmed</p><p className="text-[10px] text-gray-500 font-medium">Processing • 10:20</p></div>
                   </div>
                </div>
              </div>

              {/* Bento Box 3: Admin Shipments Management */}
              <div className="md:col-span-3 bg-white/90 dark:bg-[#0c0d12]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex flex-col md:flex-row gap-8 group hover:border-emerald-500/50 transition-colors relative overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[100px] bg-emerald-500/5 blur-3xl -translate-y-1/2 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="w-full md:w-1/3 flex flex-col justify-center relative z-10">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Network Hub</h3>
                   <p className="text-sm text-gray-500 mt-3 leading-relaxed">Complete bird&apos;s-eye view of your entire logistics network. Manage shipments, dynamically assign couriers, and resolve exceptions globally.</p>
                   <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                     <span>Explore Admin Features</span> <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
                
                <div className="flex-1 bg-gray-50 dark:bg-[#16181d] rounded-2xl p-5 border border-gray-100 dark:border-white/5 overflow-hidden shadow-inner relative z-10">
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex gap-2">
                       <span className="px-3 py-1.5 bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-white/10 rounded-md text-xs font-bold shadow-sm text-gray-900 dark:text-white">All Shipments (245)</span>
                       <span className="px-3 py-1.5 bg-transparent text-gray-500 rounded-md text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/5 transition-colors cursor-pointer">Pending (12)</span>
                     </div>
                     <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-500/30 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20">Live System</span>
                   </div>
                   
                   <div className="bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                     <div className="grid grid-cols-4 px-4 py-2.5 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                       <div>Order ID</div><div>Courier</div><div>Location</div><div className="text-right">Status</div>
                     </div>
                     <div className="grid grid-cols-4 px-4 py-3.5 border-b border-gray-100 dark:border-white/5 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                       <div className="text-xs font-mono font-bold text-gray-900 dark:text-white">#ORD-9821</div>
                       <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300"><div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.5)]"/> Delhivery</div>
                       <div className="text-xs text-gray-500 font-medium">Mumbai, MH</div>
                       <div className="text-right"><span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 rounded-full text-[10px] font-bold shadow-sm">In Transit</span></div>
                     </div>
                     <div className="grid grid-cols-4 px-4 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                       <div className="text-xs font-mono font-bold text-gray-900 dark:text-white">#ORD-9822</div>
                       <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]"/> Bluedart</div>
                       <div className="text-xs text-gray-500 font-medium">Delhi, DL</div>
                       <div className="text-right"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-full text-[10px] font-bold shadow-sm">Delivered</span></div>
                     </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-gray-200 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">
            Trusted by growing businesses everywhere
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 dark:opacity-40 grayscale">
            <h2 className="text-2xl font-black font-serif">AERO<span className="text-[#f37a2a]">FREIGHT</span></h2>
            <h2 className="text-2xl font-bold tracking-tighter">Velocity</h2>
            <h2 className="text-xl font-bold uppercase tracking-widest border-2 border-current px-2">Nexus</h2>
            <h2 className="text-2xl font-extrabold italic">Globex</h2>
            <h2 className="text-2xl font-semibold tracking-wide">Horizon</h2>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need to ship <span className="text-[#f37a2a]">smarter.</span></h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">MoveAll takes the headache out of shipping. We connect you to the best couriers and give you the tools to ensure every package arrives safely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-3xl p-10 hover:border-[#f37a2a]/50 transition-colors shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-[#fff4ed] dark:bg-[#f37a2a]/10 flex items-center justify-center mb-8">
                <Truck className="h-7 w-7 text-[#f37a2a]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Courier Selection</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Stop guessing which courier is best. We automatically choose the fastest and most cost-effective partner (like Delhivery, Bluedart, or FedEx) for every single order based on the destination pin-code.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Save money on every shipment</li>
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Faster delivery times</li>
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Access to multiple partners instantly</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-3xl p-10 hover:border-blue-500/50 transition-colors shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-8">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Reduce Returns (RTO)</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Returned orders kill your profit. Our system tracks packages in real-time and alerts you the moment a delivery fails, so you can contact the customer and save the sale before the package is sent back.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Instant delivery failure alerts</li>
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Easy customer follow-ups</li>
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Protect your profit margins</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-3xl p-10 hover:border-emerald-500/50 transition-colors shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-8">
                <Globe className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Manage Multiple Brands</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Do you run more than one store or brand? Manage all your different businesses from a single MoveAll account. Keep your billing, orders, and customer data perfectly organized.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> One login for everything</li>
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Add staff members easily</li>
                <li className="flex items-center gap-3 font-medium text-sm"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Clear, separated billing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-32 bg-white dark:bg-[#050505] border-y border-gray-200 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How MoveAll Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">We&apos;ve made shipping as simple as 1, 2, 3. No technical knowledge required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 dark:bg-[#2a2e3d] z-0" style={{ left: '16%', right: '16%' }} />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-white dark:bg-[#16181d] border-4 border-gray-100 dark:border-[#2a2e3d] flex items-center justify-center shadow-lg">
                <Package className="h-10 w-10 text-[#f37a2a]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">1. Add Your Orders</h3>
                <p className="text-gray-600 dark:text-gray-400">Enter your orders manually, upload a spreadsheet, or connect your online store directly to MoveAll.</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-white dark:bg-[#16181d] border-4 border-gray-100 dark:border-[#2a2e3d] flex items-center justify-center shadow-lg">
                <MapPin className="h-10 w-10 text-[#f37a2a]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">2. We Pick It Up</h3>
                <p className="text-gray-600 dark:text-gray-400">We automatically assign the best courier partner who will come to your location and pick up the packages.</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-white dark:bg-[#16181d] border-4 border-gray-100 dark:border-[#2a2e3d] flex items-center justify-center shadow-lg">
                <Search className="h-10 w-10 text-[#f37a2a]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">3. Track & Relax</h3>
                <p className="text-gray-600 dark:text-gray-400">Monitor all your shipments on a beautiful dashboard. We&apos;ll notify you if any delivery needs your attention.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Metrics Section */}
      <section className="py-24 bg-[#292F54] dark:bg-[#1a1e36] text-white relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f37a2a]/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <p className="text-5xl font-black text-[#f37a2a] mb-3">20%</p>
              <p className="text-lg font-medium text-white">Average reduction in shipping costs</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-black text-[#f37a2a] mb-3">2x</p>
              <p className="text-lg font-medium text-white">Faster processing of daily orders</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-black text-[#f37a2a] mb-3">15%</p>
              <p className="text-lg font-medium text-white">Drop in Return-to-Origin (RTO) rates</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-black text-[#f37a2a] mb-3">24/7</p>
              <p className="text-lg font-medium text-white">Support from dedicated logistics experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 bg-white dark:bg-[#0a0a0a] text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-8">Ready to grow your business?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Join thousands of businesses who have simplified their shipping with MoveAll. Setup takes less than 5 minutes.
          </p>
          <Link href="/client">
            <Button size="lg" className="h-16 px-12 text-xl bg-[#f37a2a] hover:bg-[#e06716] text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-[#16181d] border-t border-gray-200 dark:border-white/5 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#292F54] text-sm font-extrabold text-white">M</div>
              <span className="font-bold text-lg tracking-tight">Move All</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Making shipping simple, reliable, and affordable for businesses everywhere.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-[#f37a2a]">Courier Tracking</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Reduce RTOs</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Pricing</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-[#f37a2a]">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Partner with us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="#" className="hover:text-[#f37a2a]">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#f37a2a]">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 dark:border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 Move All Logistics. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#f37a2a]">Facebook</Link>
            <Link href="#" className="hover:text-[#f37a2a]">LinkedIn</Link>
            <Link href="#" className="hover:text-[#f37a2a]">Instagram</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
