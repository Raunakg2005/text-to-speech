'use client';

import { useState } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Play, Pause, Square, Volume2, Gauge, Music, Mic2, AlertCircle, Sparkles } from 'lucide-react';

const SAMPLE_SCRIPT = `Hello guys! Welcome to our brand-new channel! This is our first ever video, and we're really happy to start this journey with you. Today, we're bringing you Episode 1 of Perfect World — so sit back, relax, and enjoy the story. If you like the content, make sure to like, share, and subscribe. Let's begin!

The palace of Shiziling was grand, but today it felt like a cage. Inside, King Shijiling held his young son, Shi hao, tightly in his arms. Rage and fear twisted together in his heart. His own family… the people who should have protected him… wanted to kill his child.`;

export default function Home() {
    const [text, setText] = useState(SAMPLE_SCRIPT);
    const {
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
    } = useSpeechSynthesis();

    const handleSpeak = () => {
        if (text.trim()) {
            speak(text);
        }
    };

    const handlePauseResume = () => {
        if (paused) {
            resume();
        } else {
            pause();
        }
    };

    if (!supported) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-strong rounded-2xl p-8 max-w-md text-center animate-fade-in">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Browser Not Supported</h1>
                    <p className="text-gray-300">
                        Your browser doesn&apos;t support the Web Speech API. Please use Chrome or Edge for the best experience.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text">AI Text to Speech</h1>
                        <Sparkles className="w-8 h-8 text-pink-400" />
                    </div>
                    <p className="text-gray-300 text-lg">Transform your scripts into natural-sounding narration</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Text Input Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Text Area */}
                        <div className="glass-strong rounded-2xl p-6 animate-slide-up">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Mic2 className="w-5 h-5 text-purple-400" />
                                    Your Script
                                </h2>
                                <span className="text-sm text-gray-400">{text.length} characters</span>
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-64 md:h-96 bg-white/5 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter your script here..."
                            />
                        </div>

                        {/* Progress Bar */}
                        {speaking && (
                            <div className="glass rounded-xl p-4 animate-fade-in">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-300">Speaking...</span>
                                    <span className="text-sm text-purple-400">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Playback Controls */}
                        <div className="glass-strong rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Music className="w-5 h-5 text-purple-400" />
                                Playback Controls
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {!speaking ? (
                                    <button
                                        onClick={handleSpeak}
                                        className="btn-gradient px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                                    >
                                        <Play className="w-5 h-5" />
                                        Speak
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handlePauseResume}
                                            className="btn-gradient px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                                        >
                                            {paused ? (
                                                <>
                                                    <Play className="w-5 h-5" />
                                                    Resume
                                                </>
                                            ) : (
                                                <>
                                                    <Pause className="w-5 h-5" />
                                                    Pause
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={stop}
                                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
                                        >
                                            <Square className="w-5 h-5" />
                                            Stop
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <div className="space-y-6">
                        {/* Voice Selection */}
                        <div className="glass-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Mic2 className="w-5 h-5 text-purple-400" />
                                Voice
                            </h2>

                            <select
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                    const voice = voices.find(v => v.name === e.target.value);
                                    if (voice) setVoice(voice);
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                {voices.map((voice) => (
                                    <option key={voice.name} value={voice.name} className="bg-gray-900">
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Speed Control */}
                        <div className="glass-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Gauge className="w-5 h-5 text-purple-400" />
                                Speed: {rate.toFixed(1)}x
                            </h2>

                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>0.5x</span>
                                <span>2.0x</span>
                            </div>
                        </div>

                        {/* Pitch Control */}
                        <div className="glass-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Music className="w-5 h-5 text-purple-400" />
                                Pitch: {pitch.toFixed(1)}
                            </h2>

                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>0.5</span>
                                <span>2.0</span>
                            </div>
                        </div>

                        {/* Volume Control */}
                        <div className="glass-strong rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Volume2 className="w-5 h-5 text-purple-400" />
                                Volume: {Math.round(volume * 100)}%
                            </h2>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-400 text-sm">
                    <p>Using browser&apos;s built-in Web Speech API • 100% Free • No data stored</p>
                </div>
            </div>
        </main>
    );
}
