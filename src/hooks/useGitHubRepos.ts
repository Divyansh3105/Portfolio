import { useEffect, useState } from 'react';

export interface RepoData {
  stars: number;
  forks: number;
  description: string;
  topics: string[];
  language: string | null;
  updatedAt: string;
}

export interface RepoMap {
  [name: string]: RepoData;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  language: string | null;
  updated_at: string;
}

const CACHE_KEY = 'gh_repo_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  ts: number;
  data: RepoMap;
}

function readCache(): RepoMap | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: RepoMap) {
  try {
    const entry: CacheEntry = { ts: Date.now(), data };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // sessionStorage unavailable (private mode, full storage, etc.)
  }
}

export function useGitHubRepos(username: string) {
  const [repoMap, setRepoMap] = useState<RepoMap>(() => readCache() ?? {});
  const [loading, setLoading] = useState(() => readCache() === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have cached data in state, skip the fetch
    if (Object.keys(repoMap).length > 0) {
      return;
    }

    const controller = new AbortController();

    async function fetchAll() {
      try {
        // Optional GitHub PAT — add VITE_GITHUB_TOKEN to .env to raise rate limit
        // from 60/hr (unauthenticated) to 5,000/hr (authenticated)
        const token = (import.meta.env.VITE_GITHUB_TOKEN as string) || '';
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          { signal: controller.signal, headers }
        );

        if (res.status === 403) {
          const resetEpoch = res.headers.get('X-RateLimit-Reset');
          const resetMin = resetEpoch
            ? Math.ceil((Number(resetEpoch) * 1000 - Date.now()) / 60_000)
            : '?';
          throw new Error(`Rate limited — resets in ~${resetMin} min`);
        }

        if (!res.ok) throw new Error(`GitHub API ${res.status}`);

        const repos: GitHubRepo[] = await res.json();
        const map: RepoMap = {};

        repos.forEach(r => {
          map[r.name.toLowerCase()] = {
            stars:       r.stargazers_count,
            forks:       r.forks_count,
            description: r.description ?? '',
            topics:      r.topics ?? [],
            language:    r.language,
            updatedAt:   r.updated_at,
          };
        });

        writeCache(map);
        setRepoMap(map);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('[GitHub API]', (err as Error).message);
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return { repoMap, loading, error };
}

/** Returns a human-readable relative time string, e.g. "3d ago" */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diff / 60_000);
  const hours  = Math.floor(diff / 3_600_000);
  const days   = Math.floor(diff / 86_400_000);
  const months = Math.floor(days / 30);
  const years  = Math.floor(days / 365);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 30)  return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}
