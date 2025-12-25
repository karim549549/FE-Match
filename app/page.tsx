"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background-dark overflow-hidden font-display relative scanlines">
      {/* Deep Parallax Background Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep background layer - animated gradient mesh */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,0,128,0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(0,255,255,0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(255,0,128,0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,0,128,0.08) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ zIndex: -4 }}
        />

        {/* Mid layer - cyber grid */}
        <div
          className="absolute inset-0 bg-cyber-grid opacity-15 cyber-grid pointer-events-none"
          style={{ zIndex: -3 }}
        />

        {/* Foreground gradient layer */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(255,0,128,0.04)_100%)] pointer-events-none"
          style={{ zIndex: -2 }}
        />
      </div>

      {/* Noise/Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          zIndex: 1,
        }}
      />

      {/* Floating Particles System */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1920),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1080),
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, Math.random() * -300 - 100],
              x: [null, Math.random() * 150 - 75],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute border border-primary/15"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 10, 0],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header - Logo Only */}
      <header className="relative z-20 flex items-center p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary"></div>
          <span className="text-white font-mono text-sm md:text-base">
            PINK SWORDS
          </span>
        </div>
      </header>

      {/* Background MATCH Text for Depth */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          className="text-[10rem] md:text-[15rem] lg:text-[20rem] xl:text-[25rem] 2xl:text-[30rem] font-black tracking-tighter select-none"
          style={
            {
              WebkitTextStroke: "1px rgba(255, 0, 128, 0.1)",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            } as React.CSSProperties
          }
        >
          MATCH
        </h1>
      </div>

      {/* Main Content */}
      <main
        className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-120px)] px-4"
        style={{ zIndex: 10 }}
      >
        {/* Central MATCH Logo Section */}
        <div className="relative flex flex-col items-center">
          {/* Top Label - Hidden on large screens, shown in info labels */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 lg:hidden"
          >
            <p className="text-primary/70 font-mono text-xs md:text-sm uppercase tracking-widest text-center">
              SARVORECIUS SFRVVE SCOTINER
            </p>
          </motion.div>

          {/* Main MATCH Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <h1
              className="text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] font-black text-white tracking-tighter glitch-text relative z-10"
              data-text="MATCH"
              style={{
                textShadow: `
                  0 0 10px rgba(255,0,128,0.6),
                  0 0 20px rgba(255,0,128,0.4),
                  0 0 30px rgba(255,0,128,0.3),
                  0 0 40px rgba(255,0,128,0.2),
                  0 0 60px rgba(255,0,128,0.1),
                  0 10px 20px rgba(0,0,0,0.6),
                  0 20px 40px rgba(0,0,0,0.4),
                  0 30px 60px rgba(0,0,0,0.2)
                `,
              }}
            >
              MATCH
            </h1>

            {/* Enhanced Glow effect with multiple layers */}
            <div className="absolute inset-0 bg-primary/25 blur-3xl -z-10"></div>
            <div className="absolute inset-0 bg-primary/15 blur-[60px] -z-11"></div>
            <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] -z-12"></div>

            {/* Enhanced Scattered fragments with glow */}
            <motion.div
              className="absolute -top-4 -left-4 w-2 h-2 bg-primary rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0 0 5px rgba(255,0,128,0.5)",
                  "0 0 15px rgba(255,0,128,0.8)",
                  "0 0 5px rgba(255,0,128,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -top-8 right-8 w-1 h-1 bg-primary rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0 0 5px rgba(255,0,128,0.5)",
                  "0 0 15px rgba(255,0,128,0.8)",
                  "0 0 5px rgba(255,0,128,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-4 -left-8 w-1.5 h-1.5 bg-primary rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0 0 5px rgba(255,0,128,0.5)",
                  "0 0 15px rgba(255,0,128,0.8)",
                  "0 0 5px rgba(255,0,128,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute -bottom-4 right-4 w-2 h-2 bg-primary rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0 0 5px rgba(255,0,128,0.5)",
                  "0 0 15px rgba(255,0,128,0.8)",
                  "0 0 5px rgba(255,0,128,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </motion.div>

          {/* Navigation Cards Around MATCH */}
          <div className="absolute inset-0 pointer-events-auto hidden lg:block">
            {/* Left Side - TRADE Card */}
            <button className="absolute top-1/4 -left-48 xl:-left-64 2xl:-left-80 group cursor-pointer transform rotate-[-8deg] hover:rotate-[-6deg] transition-transform duration-300">
              <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)]">
                <div className="text-primary font-mono text-xs uppercase mb-1">
                  TRADE
                </div>
                <div className="text-white font-mono text-sm">MARKETPLACE</div>
              </div>
            </button>

            {/* Right Side - EXPLORE Card */}
            <button className="absolute top-1/4 -right-48 xl:-right-64 2xl:-right-80 group cursor-pointer transform rotate-[12deg] hover:rotate-[10deg] transition-transform duration-300">
              <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)]">
                <div className="text-primary font-mono text-xs uppercase mb-1">
                  EXPLORE
                </div>
                <div className="text-white font-mono text-sm">DISCOVER</div>
              </div>
            </button>

            {/* Top Center - VAULT Card */}
            <button className="absolute -top-24 xl:-top-32 2xl:-top-40 left-1/2 -translate-x-1/2 text-center group cursor-pointer transform rotate-[5deg] hover:rotate-[3deg] transition-transform duration-300">
              <div className="text-white/50 font-mono text-xs mb-2 group-hover:text-white transition-colors">
                12181/10009911
              </div>
              <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)]">
                <div className="text-primary font-mono text-xs uppercase mb-1">
                  VAULT
                </div>
                <div className="text-white font-mono text-sm">STORAGE</div>
              </div>
            </button>

            {/* Bottom Right - COMMUNITY Card */}
            <button className="absolute bottom-1/4 -right-48 xl:-right-64 2xl:-right-80 group cursor-pointer transform rotate-[-15deg] hover:rotate-[-13deg] transition-transform duration-300">
              <div className="bg-black/80 border border-primary/30 rounded-lg px-4 py-3 group-hover:border-primary transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,128,0.2)]">
                <div className="text-primary font-mono text-xs uppercase mb-1">
                  COMMUNITY
                </div>
                <div className="text-white font-mono text-sm">SOCIAL</div>
              </div>
            </button>
          </div>

          {/* Enter Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 md:mt-24"
          >
            <button className="group relative px-12 py-5 bg-black border border-gray-600 hover:border-gray-400 text-white font-mono text-base md:text-lg font-bold uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer flex items-center gap-3">
              <span>ENTER THE REALM</span>
              <svg
                className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </motion.div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-center space-y-2"
          >
            <p className="text-white/50 font-mono text-xs">ERENCANARE 15</p>
            <p className="text-white/70 font-mono text-xs md:text-sm">
              Scroll to Discover Rare Loot
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex justify-center mt-4"
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Swipe Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            {/* SWIPE LEFT (REJECT) Button */}
            <button
              className="group relative px-10 py-5 bg-primary hover:bg-[#d6006b] text-white font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(255,0,128,0.6)] hover:shadow-[0_0_35px_rgba(255,0,128,0.9)] overflow-hidden"
              style={{
                clipPath:
                  "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              }}
            >
              {/* Glitch effect lines */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60 animate-pulse"></div>
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-white/60 animate-pulse"
                  style={{ animationDelay: "0.15s" }}
                ></div>
                <div
                  className="absolute top-0 left-0 w-[1px] h-full bg-white/40 animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="absolute top-0 right-0 w-[1px] h-full bg-white/40 animate-pulse"
                  style={{ animationDelay: "0.45s" }}
                ></div>
              </div>
              {/* Angled corner cut-outs */}
              <div className="absolute top-0 left-0 w-6 h-6">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/60"></div>
                <div className="absolute top-2 left-2 w-4 h-4 bg-primary"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6">
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/60"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary"></div>
              </div>
              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-base md:text-lg">SWIPE LEFT</span>
                <span className="text-xs md:text-sm opacity-90">(REJECT)</span>
              </div>
            </button>

            {/* SWIPE RIGHT (MATCH) Button */}
            <button
              className="group relative px-10 py-5 bg-primary hover:bg-[#d6006b] text-white font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(255,0,128,0.6)] hover:shadow-[0_0_35px_rgba(255,0,128,0.9)] overflow-hidden"
              style={{
                clipPath:
                  "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              }}
            >
              {/* Glitch effect lines */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60 animate-pulse"></div>
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-white/60 animate-pulse"
                  style={{ animationDelay: "0.15s" }}
                ></div>
                <div
                  className="absolute top-0 left-0 w-[1px] h-full bg-white/40 animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="absolute top-0 right-0 w-[1px] h-full bg-white/40 animate-pulse"
                  style={{ animationDelay: "0.45s" }}
                ></div>
              </div>
              {/* Angled corner cut-outs */}
              <div className="absolute top-0 left-0 w-6 h-6">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/60"></div>
                <div className="absolute top-2 left-2 w-4 h-4 bg-primary"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6">
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/60"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary"></div>
              </div>
              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-base md:text-lg">SWIPE RIGHT</span>
                <span className="text-xs md:text-sm opacity-90">(MATCH)</span>
              </div>
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
