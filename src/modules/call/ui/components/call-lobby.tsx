import Link from "next/link";
import { LogInIcon, VideoIcon, MicIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatarUri({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermissions = () => {
  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center">
      <div className="flex items-center gap-2 text-blue-400 mb-2">
        <VideoIcon className="size-5" />
        <MicIcon className="size-5" />
      </div>
      <p className="text-sm text-white/80">
        Please grant your browser permission to access your camera and
        microphone.
      </p>
    </div>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="py-4 px-8 flex flex-1 items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center gap-8 backdrop-blur-xl bg-black/30 border border-white/5 rounded-2xl p-10 max-w-2xl w-full">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Ready to join?
            </h2>
            <p className="text-sm text-white/70">
              Set up your call before joining
            </p>
          </div>

          {/* Video Preview */}
          <div className="w-full max-w-md">
            <div className="relative rounded-xl overflow-hidden border border-white/5 bg-black/20">
              <VideoPreview
                DisabledVideoPreview={
                  hasBrowserMediaPermission
                    ? DisabledVideoPreview
                    : AllowBrowserPermissions
                }
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <div className="rounded-lg p-2 hover:bg-white/5 transition-colors">
              <ToggleAudioPreviewButton />
            </div>
            <div className="rounded-lg p-2 hover:bg-white/5 transition-colors">
              <ToggleVideoPreviewButton />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 w-full pt-2">
            <Button
              asChild
              variant="ghost"
              className="flex-1 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Link href="/interviews">Cancel</Link>
            </Button>
            <Button
              onClick={onJoin}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <LogInIcon className="size-4 mr-2" />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
