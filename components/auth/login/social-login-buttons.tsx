import { GoogleIcon, AppleIcon } from "@/components/icons";

export function SocialLoginButtons() {
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-surface-dark text-gray-500 font-mono uppercase">
            Or authenticate via
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border border-gray-700 bg-[#1a1a1a] hover:bg-[#252525] hover:border-gray-500 rounded-sm transition-all group cursor-pointer"
        >
          <GoogleIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="ml-3 text-sm font-mono text-gray-400 group-hover:text-white">
            Google
          </span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border border-gray-700 bg-[#1a1a1a] hover:bg-[#252525] hover:border-gray-500 rounded-sm transition-all group cursor-pointer"
        >
          <AppleIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="ml-3 text-sm font-mono text-gray-400 group-hover:text-white">
            Apple
          </span>
        </button>
      </div>
    </>
  );
}
