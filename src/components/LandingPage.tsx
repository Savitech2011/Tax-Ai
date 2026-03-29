import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Play, ArrowRight, CheckCircle2, FileText, Code, 
  Shield, Zap, BarChart3, Users, Building2, ChevronRight,
  UploadCloud, BrainCircuit, Receipt, Star, Check, ArrowUpRight, Calculator, Landmark
} from 'lucide-react';
import AuthModal from './AuthModal';

const fadeIn: any = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
};

const staggerContainer: any = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { staggerChildren: 0.1, delayChildren: 0.1 }
};

const staggerItem: any = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
};

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const handleLoginClick = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] relative overflow-hidden font-sans text-gray-900 selection:bg-purple-200">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-300/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-300/30 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } as any}
        className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            TaxAI
          </div>
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-black transition-colors">Testimonials</a>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={handleLoginClick} className="text-[15px] font-medium text-gray-600 hover:text-black transition-colors hidden sm:block">Log in</button>
          <button 
            onClick={handleRegisterClick}
            className="text-[15px] font-medium bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
          >
            Ask TaxAI for Free
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 md:pt-28 pb-32 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-gray-200/60 backdrop-blur-md mb-8 shadow-sm hover:bg-white/80 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Introducing TaxAI 2.0</span>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <span className="text-sm font-medium text-purple-600 flex items-center gap-1">Read announcement <ChevronRight className="w-3 h-3" /></span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-5xl md:text-7xl lg:text-[80px] leading-[1.1] font-bold tracking-tight text-gray-900 mb-6 max-w-5xl"
        >
          Your Personal Tax assistant.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl font-medium leading-relaxed"
        >
          Tax calculations, filing, and deep legal analysis powered by real intelligence. <br className="hidden md:block" />
          No accountant, no complex software, no learning curve.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24 w-full sm:w-auto"
        >
          <button 
            onClick={handleRegisterClick}
            className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
          >
            Ask TaxAI for Free
          </button>
          <button className="w-full sm:w-auto bg-white/50 border border-gray-200 backdrop-blur-md text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-white transition-all flex items-center justify-center gap-2 shadow-sm">
            <Play className="w-5 h-5 fill-current" />
            Watch Trailer
          </button>
        </motion.div>

        {/* Floating Input Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 12 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-full max-w-4xl mx-auto perspective-1000"
        >
          <div className="absolute inset-0 -top-24 -bottom-24 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          <div className="relative bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-4 text-left hover:rotate-x-0 transition-transform duration-700 ease-out">
            <div className="bg-white rounded-2xl p-6 min-h-[160px] shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-gray-400 text-xl font-medium">Help me calculate my freelance tax deductions for 2025, considering I bought a new laptop and traveled for 3 conferences...</p>
              <div className="flex justify-between items-end mt-8">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Social Proof */}
      <motion.section {...fadeIn} className="py-12 border-y border-gray-200/50 bg-white/30 backdrop-blur-sm relative z-10">
        <p className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-widest">Trusted by innovative teams and individuals</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale px-4">
          <div className="flex items-center gap-2 font-bold text-xl"><Building2 className="w-6 h-6" /> Acme Corp</div>
          <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6" /> Flash Inc</div>
          <div className="flex items-center gap-2 font-bold text-xl"><Code className="w-6 h-6" /> DevStudio</div>
          <div className="flex items-center gap-2 font-bold text-xl"><Landmark className="w-6 h-6" /> GlobalBank</div>
        </div>
      </motion.section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-4 max-w-7xl mx-auto relative z-10">
        <motion.div {...fadeIn} className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Taxes done in three simple steps</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">No more confusing forms. Just connect your data, let the AI analyze it, and review your optimized return.</p>
        </motion.div>

        <div className="space-y-32">
          {/* Step 1 */}
          <motion.div {...fadeIn} className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">1</div>
              <h3 className="text-3xl font-bold">Upload your documents</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Drop your W-2s, 1099s, receipts, and CSV exports directly into the chat. TaxAI securely parses and categorizes everything instantly. No manual data entry required.
              </p>
              <ul className="space-y-3 pt-4">
                {['Supports PDF, CSV, and Images', 'Bank-level encryption', 'Automatic categorization'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent rounded-[2rem] opacity-50" />
                <div className="relative border-2 border-dashed border-blue-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-blue-50/50">
                  <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
                  <p className="font-medium text-gray-900">Drag & drop your tax documents</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div {...fadeIn} className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xl">2</div>
              <h3 className="text-3xl font-bold">AI analyzes and optimizes</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our advanced reasoning engine cross-references your data with the latest tax codes, finding every possible deduction and credit you qualify for.
              </p>
              <ul className="space-y-3 pt-4">
                {['Real-time tax code updates', 'Identifies hidden deductions', 'Explains reasoning clearly'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-purple-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 to-transparent rounded-[2rem] opacity-50" />
                <div className="relative space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50">
                    <BrainCircuit className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Analyzing 1099-NEC...</p>
                      <p className="text-sm text-gray-500">Found $4,200 in eligible business expenses.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50 opacity-70">
                    <Calculator className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Calculating Standard vs Itemized...</p>
                      <p className="text-sm text-gray-500">Itemized deduction saves you $1,250.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div {...fadeIn} className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center font-bold text-xl">3</div>
              <h3 className="text-3xl font-bold">Review and file</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Get a comprehensive, easy-to-read summary of your return. Once you approve, TaxAI generates the exact forms you need or files them directly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Audit defense included', 'Instant form generation', 'Direct IRS e-filing'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent rounded-[2rem] opacity-50" />
                <div className="relative bg-gray-900 rounded-xl p-8 text-white">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-gray-400 font-medium">Estimated Refund</span>
                    <Receipt className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-5xl font-bold mb-2">$3,450.00</div>
                  <p className="text-green-400 text-sm font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> +$850 vs last year
                  </p>
                  <button className="w-full mt-8 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    File Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Dark Mode */}
      <section id="features" className="bg-[#0a0a0a] text-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Find your ideal deductions just by asking</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Describe your financial situation. Add your income sources, expenses, and investments. TaxAI builds a qualified tax report in seconds.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature Card 1 */}
            <motion.div variants={staggerItem} className="bg-[#141414] border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Citizen Mode</h3>
              <p className="text-gray-400 leading-relaxed">
                Perfect for individuals and freelancers. Get quick answers about tax brackets, standard deductions, and simple filing questions without the jargon.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div variants={staggerItem} className="bg-[#141414] border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Building2 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Officer Mode</h3>
              <p className="text-gray-400 leading-relaxed">
                Designed for complex scenarios. Upload massive datasets, request deep legal analysis, and generate custom tax calculators with full transparency into the AI's reasoning.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div variants={staggerItem} className="bg-[#141414] border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
                <Shield className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Bank-Level Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Your financial data is encrypted and never used to train our models. We employ enterprise-grade security protocols to ensure your sensitive information remains private.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Use Cases */}
      <section className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Built for every tax situation</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Whether you're a W-2 employee or running a complex LLC, TaxAI adapts to your specific needs.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            <motion.div variants={staggerItem} className="md:col-span-2 bg-gradient-to-br from-orange-50 to-rose-50 rounded-[2rem] p-10 border border-orange-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Freelancers & Creators</h3>
                <p className="text-gray-600 text-lg max-w-md">Automatically categorize 1099 income, track home office deductions, and calculate quarterly estimated payments.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-64 h-64 text-orange-500" />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem] p-10 border border-blue-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Crypto & Stocks</h3>
                <p className="text-gray-600">Import trading history to instantly calculate capital gains, losses, and wash sales.</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:scale-110 transition-transform duration-700">
                <BarChart3 className="w-40 h-40 text-blue-500" />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2rem] p-10 border border-emerald-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Small Business</h3>
                <p className="text-gray-600">Handle payroll taxes, depreciation, and K-1s with enterprise-grade accuracy.</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Building2 className="w-40 h-40 text-emerald-500" />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="md:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[2rem] p-10 border border-purple-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Real Estate Investors</h3>
                <p className="text-gray-600 text-lg max-w-md">Manage rental income, property depreciation schedules, and 1031 exchanges seamlessly.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Landmark className="w-64 h-64 text-purple-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Loved by thousands</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Don't just take our word for it. See what our users have to say.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { name: "Sarah Jenkins", role: "Freelance Designer", text: "TaxAI found $2,400 in deductions I completely missed last year. The chat interface is so much better than filling out forms." },
              { name: "Michael Chen", role: "Small Business Owner", text: "I used to pay my accountant $1,500 just to file my LLC taxes. TaxAI did it in 15 minutes for a fraction of the cost. Incredible." },
              { name: "Elena Rodriguez", role: "Day Trader", text: "Handling crypto and stock trades used to be a nightmare. I just uploaded my CSVs and TaxAI generated my Schedule D perfectly." }
            ].map((review, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">Start for free, upgrade when you need more power.</p>
            
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-full">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${!isAnnual ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${isAnnual ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Annually <span className="text-green-500 ml-1">-20%</span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Free Tier */}
            <motion.div variants={staggerItem} className="bg-white border border-gray-200 rounded-[2rem] p-10 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-gray-500 mb-6">For simple W-2 tax situations.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-500">/file</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['W-2 Income processing', 'Standard deduction calculation', 'Basic chat support', 'State & Federal filing'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <button onClick={handleRegisterClick} className="w-full py-4 rounded-full font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                Get Started Free
              </button>
            </motion.div>

            {/* Pro Tier */}
            <motion.div variants={staggerItem} className="bg-black text-white border border-gray-800 rounded-[2rem] p-10 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Sparkles className="w-32 h-32 text-purple-500" />
              </div>
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider rounded-full mb-4">Most Popular</div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">For freelancers, investors, and small businesses.</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">${isAnnual ? '49' : '59'}</span>
                  <span className="text-gray-400">/file</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {['Everything in Basic', '1099 & Schedule C processing', 'Crypto & Stock imports', 'Audit defense included', 'Priority AI processing'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-purple-400" /> {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={handleRegisterClick} className="w-full py-4 rounded-full font-bold bg-white text-black hover:bg-gray-100 transition-colors">
                  Upgrade to Pro
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            Stop stressing over taxes.
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of individuals and professionals who have upgraded their tax workflow with real AI.
          </p>
          <button 
            onClick={handleRegisterClick}
            className="bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Get Started for Free
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            TaxAI
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <div className="text-sm">
            © 2026 TaxAI Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
