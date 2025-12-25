export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
      <div className="bg-surface-dark border border-primary/50 shadow-[0_0_30px_rgba(255,0,128,0.15)] rounded-sm p-8 md:p-12 max-w-2xl w-full">
        <h1 className="text-2xl md:text-3xl font-mono text-primary mb-6">
          &lt;SUPPORT_CENTER /&gt;
        </h1>
        <p className="text-white/70 font-mono text-sm mb-4">
          Support page coming soon...
        </p>
        <a
          href="/auth/login"
          className="text-sm font-mono text-primary/70 hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all cursor-pointer inline-block"
        >
          &lt;RETURN_TO_LOGIN /&gt;
        </a>
      </div>
    </div>
  );
}
