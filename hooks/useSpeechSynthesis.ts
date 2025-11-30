import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
    voices: SpeechSynthesisVoice[];
    speaking: boolean;
    paused: boolean;
    speak: (text: string) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    setVoice: (voice: SpeechSynthesisVoice) => void;
    setRate: (rate: number) => void;
    setPitch: (pitch: number) => void;
    setVolume: (volume: number) => void;
    selectedVoice: SpeechSynthesisVoice | null;
    rate: number;
    pitch: number;
    volume: number;
    progress: number;
    supported: boolean;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);

                // Set default voice (prefer English voices)
                if (availableVoices.length > 0 && !selectedVoice) {
                    const englishVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                    setSelectedVoice(englishVoice);
                }
            };

            loadVoices();

            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }, [selectedVoice]);

    const speak = useCallback((text: string) => {
        if (!supported) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => {
            setSpeaking(true);
            setPaused(false);
            setProgress(0);
        };

        utterance.onend = () => {
            setSpeaking(false);
            setPaused(false);
            setProgress(100);
        };

        utterance.onerror = () => {
            setSpeaking(false);
            setPaused(false);
        };

        utterance.onboundary = (event) => {
            // Calculate progress based on character position
            const progressPercent = (event.charIndex / text.length) * 100;
            setProgress(progressPercent);
        };

        window.speechSynthesis.speak(utterance);
    }, [supported, selectedVoice, rate, pitch, volume]);

    const pause = useCallback(() => {
        if (supported && speaking) {
            window.speechSynthesis.pause();
            setPaused(true);
        }
    }, [supported, speaking]);

    const resume = useCallback(() => {
        if (supported && paused) {
            window.speechSynthesis.resume();
            setPaused(false);
        }
    }, [supported, paused]);

    const stop = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            setPaused(false);
            setProgress(0);
        }
    }, [supported]);

    const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
        setSelectedVoice(voice);
    }, []);

    return {
        voices,
        speaking,
        paused,
        speak,
        pause,
        resume,
        stop,
        setVoice,
        setRate,
        setPitch,
        setVolume,
        selectedVoice,
        rate,
        pitch,
        volume,
        progress,
        supported,
    };
};
