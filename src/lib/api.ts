// ─── api.ts — single data access layer ───────────────────────
// Toggle USE_MOCK to false and set VITE_API_URL to connect to the real backend.

import { engine, isQuestion } from './engine';
import type { Report, NextQuestionResult } from './engine';

const USE_MOCK = true;
const API_URL = import.meta.env.VITE_API_URL || '';

// ─── Types ────────────────────────────────────────────────────
export type { Report, NextQuestionResult };
export { isQuestion };

export interface Message {
  id: string;
  from: 'user' | 'staff';
  body: string;
  ts: number;
}

// ─── Helpers ──────────────────────────────────────────────────
function headers() {
  const token = localStorage.getItem('pathora_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Chat storage helpers (shared between portal & staff) ─────
const CHAT_KEY = (id: string) => `pathora_chat_${id}`;
export function getStoredChats(accountId: string): Message[] {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY(accountId)) || '[]'); } catch { return []; }
}
export function storeChats(accountId: string, msgs: Message[]) {
  localStorage.setItem(CHAT_KEY(accountId), JSON.stringify(msgs));
}

// ─── API functions ────────────────────────────────────────────

export async function createSession(ageBand: string): Promise<{ sessionId: string }> {
  if (USE_MOCK) {
    const res = engine.createSession(ageBand);
    return res;
  }
  return post('/session', { ageBand });
}

export async function getNextQuestion(sessionId: string): Promise<NextQuestionResult> {
  if (USE_MOCK) return engine.getNextQuestion(sessionId);
  return get(`/session/${sessionId}/next`);
}

export async function submitAnswer(sessionId: string, questionId: string, optionId: string): Promise<{ ok: boolean }> {
  if (USE_MOCK) return engine.submitAnswer(sessionId, questionId, optionId);
  return post(`/session/${sessionId}/answer`, { questionId, optionId });
}

export async function undoAnswer(sessionId: string): Promise<{ ok: boolean }> {
  if (USE_MOCK) return engine.undoLastAnswer(sessionId);
  return post(`/session/${sessionId}/undo`, {});
}

export async function getTeaser(sessionId: string): Promise<{ teaser: string; price: number; currency: string }> {
  if (USE_MOCK) return engine.getTeaser(sessionId);
  return get(`/session/${sessionId}/teaser`);
}

export async function checkout(
  sessionId: string,
  details: { name: string; email: string; phone: string; country: string; consent: boolean }
): Promise<{ username: string; password: string; portalUrl: string; report: Report }> {
  if (USE_MOCK) return engine.checkout(sessionId, details);
  return post(`/session/${sessionId}/checkout`, details);
}

export async function login(username: string, password: string): Promise<{ token: string; firstName?: string }> {
  if (USE_MOCK) return engine.login(username, password);
  return post('/login', { username, password });
}

export async function getReport(): Promise<Report> {
  if (USE_MOCK) {
    const username = localStorage.getItem('pathora_user') || '';
    return engine.getReport(username);
  }
  return get('/report');
}

export async function getChat(): Promise<Message[]> {
  const username = localStorage.getItem('pathora_user') || '';
  if (USE_MOCK) return getStoredChats(username);
  return get('/chat');
}

export async function sendChat(body: string): Promise<{ ok: true }> {
  const username = localStorage.getItem('pathora_user') || '';
  if (USE_MOCK) {
    const msgs = getStoredChats(username);
    const msg: Message = { id: Date.now().toString(), from: 'user', body, ts: Date.now() };
    storeChats(username, [...msgs, msg]);
    // Notify all staff-chat listeners via storage event
    return { ok: true };
  }
  return post('/chat', { body });
}

// ─── Staff API ────────────────────────────────────────────────
export async function getStaffChats(): Promise<{ accountId: string; messages: Message[] }[]> {
  if (USE_MOCK) {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('pathora_chat_')) keys.push(k);
    }
    return keys.map(k => ({
      accountId: k.replace('pathora_chat_', ''),
      messages: JSON.parse(localStorage.getItem(k) || '[]'),
    })).filter(c => c.messages.length > 0);
  }
  return get('/admin/chats');
}

export async function staffReply(accountId: string, body: string): Promise<{ ok: true }> {
  if (USE_MOCK) {
    const msgs = getStoredChats(accountId);
    const msg: Message = { id: Date.now().toString(), from: 'staff', body, ts: Date.now() };
    storeChats(accountId, [...msgs, msg]);
    return { ok: true };
  }
  return post('/admin/reply', { accountId, body });
}
