"use client";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { Letter } from "@/types";
import { publicAssetPath } from "@/lib/paths";
export function AudioButton({ letter }: { letter: Letter }) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const update = () =>
      setVoice(
        window.speechSynthesis
          .getVoices()
          .find((v) => /^ml(?:-|_|$)/i.test(v.lang)),
      );
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", update);
      window.speechSynthesis.cancel();
    };
  }, []);
  const available = !!letter.audioUrl || !!voice;
  function play() {
    setMessage("");
    if (letter.audioUrl) {
      const audio = new Audio(publicAssetPath(letter.audioUrl));
      setPlaying(true);
      audio.onended = () => setPlaying(false);
      audio.onerror = () => {
        setPlaying(false);
        setMessage("Recording could not be loaded.");
      };
      void audio.play().catch(() => {
        setPlaying(false);
        setMessage("Recording could not be played.");
      });
    } else if (voice) {
      const utterance = new SpeechSynthesisUtterance(
        letter.category === "signs" ? `ക${letter.glyph}` : letter.glyph,
      );
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.75;
      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => {
        setPlaying(false);
        setMessage("The Malayalam browser voice is unavailable.");
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }
  return (
    <div className="audio-control">
      <button
        className="audio-button"
        disabled={!available || playing}
        onClick={play}
        aria-label={available ? "Play pronunciation" : "Audio unavailable"}
        title={
          available
            ? "Browser Malayalam voice; pronunciation quality may vary"
            : "No recording or Malayalam browser voice available"
        }
      >
        {available ? <Volume2 size={19} /> : <VolumeX size={19} />}
        <span>
          {playing
            ? "Playing…"
            : letter.audioUrl
              ? "Listen"
              : voice
                ? "Browser voice"
                : "Audio coming soon"}
        </span>
      </button>
      {message && <span role="status">{message}</span>}
    </div>
  );
}
