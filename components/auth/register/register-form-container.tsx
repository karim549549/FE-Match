"use client";

interface RegisterFormContainerProps {
  isExpanded: boolean;
}

export function RegisterFormContainer({}: RegisterFormContainerProps) {
  return (
    <div className="w-3/4 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none lg:hidden cyber-grid"></div>
      <div className="relative w-full max-w-[480px]">
        {/* Form content will be added here later */}
        <div className="bg-surface-dark border border-primary/50 shadow-[0_0_30px_rgba(255,0,128,0.15)] rounded-sm p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#ff0080]"></div>
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>

          <div className="text-center">
            <h2 className="text-xl font-mono text-primary mb-4">
              &lt;REGISTER_FORM /&gt;
            </h2>
            <p className="text-sm font-mono text-gray-400">
              Form content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
