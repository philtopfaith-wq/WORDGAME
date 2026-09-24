/**
 * Browser Text-to-Speech (TTS) manager with British and American pronunciation.
 * Handles SpeechSynthesis lifecycle, voice selection, pause/resume, and graceful fallback.
 */

import { LanguageVariant } from '../types';

export interface SpeechStatus {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
}

class SpeechManager {
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private listeners: Set<(status: SpeechStatus) => void> = new Set();
  private isPaused: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    try {
      this.voices = window.speechSynthesis.getVoices();
    } catch {
      this.voices = [];
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribe(callback: (status: SpeechStatus) => void) {
    this.listeners.add(callback);
    this.notify();
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach(cb => cb(status));
  }

  public getStatus(): SpeechStatus {
    const supported = this.isSupported();
    const speaking = supported ? window.speechSynthesis.speaking : false;
    return {
      supported,
      speaking,
      paused: this.isPaused,
    };
  }

  private findVoice(variant: LanguageVariant): SpeechSynthesisVoice | null {
    if (!this.voices.length) {
      this.loadVoices();
    }
    const targetLang = variant === 'british' ? 'en-GB' : 'en-US';
    
    // First exact locale match
    let match = this.voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
    if (match) return match;

    // Second: name or lang search
    if (variant === 'british') {
      match = this.voices.find(v => 
        v.lang.startsWith('en-GB') || 
        v.name.toLowerCase().includes('united kingdom') || 
        v.name.toLowerCase().includes('uk') || 
        v.name.toLowerCase().includes('british')
      );
    } else {
      match = this.voices.find(v => 
        v.lang.startsWith('en-US') || 
        v.name.toLowerCase().includes('united states') || 
        v.name.toLowerCase().includes('us') || 
        v.name.toLowerCase().includes('american')
      );
    }
    if (match) return match;

    // Fallback: any English voice
    match = this.voices.find(v => v.lang.startsWith('en'));
    return match || this.voices[0] || null;
  }

  public speak(
    text: string, 
    variant: LanguageVariant = 'british', 
    rate: number = 0.95,
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported()) return false;

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.6, Math.min(1.4, rate));
      utterance.pitch = 1.0;
      utterance.lang = variant === 'british' ? 'en-GB' : 'en-US';

      const voice = this.findVoice(variant);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.isPaused = false;
        this.notify();
      };

      utterance.onend = () => {
        this.isPaused = false;
        this.utterance = null;
        this.notify();
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isPaused = false;
        this.utterance = null;
        this.notify();
        if (onEnd) onEnd();
      };

      utterance.onpause = () => {
        this.isPaused = true;
        this.notify();
      };

      utterance.onresume = () => {
        this.isPaused = false;
        this.notify();
      };

      this.utterance = utterance;
      window.speechSynthesis.speak(utterance);
      this.notify();
      return true;
    } catch {
      this.isPaused = false;
      this.utterance = null;
      this.notify();
      return false;
    }
  }

  public pause() {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.notify();
    } catch {
      // Graceful fallback
    }
  }

  public resume() {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.notify();
    } catch {
      // Graceful fallback
    }
  }

  public stop() {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.cancel();
      this.isPaused = false;
      this.utterance = null;
      this.notify();
    } catch {
      // Graceful fallback
    }
  }
}

export const speech = new SpeechManager();
