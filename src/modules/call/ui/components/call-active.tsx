import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface Props {
  onLeave: () => void;
  interviewName: string;
}

export const CallActive = ({ onLeave, interviewName }: Props) => {
  return (
    <div className="relative flex flex-col h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-5 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Image
                src="/intervw_mini.webp"
                width={20}
                height={20}
                alt="Logo"
                className="object-contain"
              />
            </Link>
            <div className="flex flex-col">
              <h4 className="text-sm font-medium text-white/90">
                {interviewName}
              </h4>
              <span className="text-xs text-white/60">
                Interview in progress
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-white/70">Live</span>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-32 px-4">
        <div className="w-full h-full max-w-7xl">
          <SpeakerLayout />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-6 py-6">
        <div className="flex items-center justify-center">
          <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
            <CallControls onLeave={onLeave} />
          </div>
        </div>
      </div>
    </div>
  );
};
