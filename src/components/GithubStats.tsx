import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Github, Star, GitFork, Users, BookOpen,
  TrendingUp, Award, RefreshCw, ExternalLink,
  Calendar, Code2, Pin,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// ─── Config ───────────────────────────────────────────────────────────────────
// Ganti GITHUB_USERNAME jika akun berubah
const GITHUB_USERNAME    = 'BadutZY';
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// ─── Language colors ──────────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  Java: '#b07219', TypeScript: '#3178c6', JavaScript: '#f1e05a',
  'C#': '#178600', CSS: '#563d7c', HTML: '#e34c26',
  PHP: '#4F5D95', Python: '#3572A5', Kotlin: '#A97BFF',
  Rust: '#dea584', Go: '#00ADD8', Swift: '#F05138',
  GLSL: '#5686a5', HLSL: '#aace60', Lua: '#000080',
  Shell: '#89e051', Groovy: '#e69f56',
};
const getLangColor = (l: string) => LANG_COLORS[l] ?? '#8b949e';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GitHubUser {
  name: string; login: string; bio: string;
  avatar_url: string; public_repos: number;
  followers: number; following: number; created_at: string;
}
interface GitHubRepo {
  name: string; stargazers_count: number; forks_count: number;
  language: string | null; html_url: string;
  description: string | null; updated_at: string;
}
interface PinnedRepo {
  owner: string; repo: string; description: string;
  language: string; languageColor: string;
  stars: number; forks: number; link: string;
}
interface LangStats { name: string; bytes: number; percentage: number; }
interface GitHubData {
  user: GitHubUser; repos: GitHubRepo[];
  pinnedRepos: PinnedRepo[]; langs: LangStats[];
  totalStars: number; totalForks: number;
  fetchedAt: number;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchGitHubData(): Promise<GitHubData> {
  const gh: HeadersInit = { Accept: 'application/vnd.github+json' };

  // 1. User + repos (parallel)
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers: gh }),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers: gh }),
  ]);
  if (!userRes.ok) throw new Error(`GitHub API ${userRes.status}`);
  const user: GitHubUser = await userRes.json();
  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

  // Aggregate
  let totalStars = 0, totalForks = 0;
  repos.forEach(r => { totalStars += r.stargazers_count; totalForks += r.forks_count; });

  // 2. Starred repos — show the 4 most recently starred repos
  let pinnedRepos: PinnedRepo[] = [];
  try {
    const starredRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=4&sort=created&direction=desc`,
      { headers: gh }
    );
    if (starredRes.ok) {
      const raw: any[] = await starredRes.json();
      if (Array.isArray(raw)) {
        pinnedRepos = raw.slice(0, 4).map(r => ({
          owner:         r.owner?.login ?? r.full_name?.split('/')[0] ?? GITHUB_USERNAME,
          repo:          r.name ?? '',
          description:   r.description ?? '',
          language:      r.language ?? '',
          languageColor: getLangColor(r.language ?? ''),
          stars:         Number(r.stargazers_count ?? 0),
          forks:         Number(r.forks_count ?? 0),
          link:          r.html_url ?? `https://github.com/${r.full_name}`,
        }));
      }
    }
  } catch { /* fallback below */ }

  // Fallback: if starred fetch failed, use own top-starred repos
  if (pinnedRepos.length === 0) {
    pinnedRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map(r => ({
        owner: GITHUB_USERNAME, repo: r.name,
        description: r.description ?? '',
        language: r.language ?? '',
        languageColor: getLangColor(r.language ?? ''),
        stars: r.stargazers_count, forks: r.forks_count,
        link: r.html_url,
      }));
  }

  // Exactly 4
  pinnedRepos = pinnedRepos.slice(0, 4);

  // 3. Language bytes (up to 8 repos)
  const langBytes: Record<string, number> = {};
  await Promise.allSettled(
    repos.filter(r => r.language).slice(0, 8).map(async repo => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
          { headers: gh }
        );
        if (!res.ok) return;
        const d: Record<string, number> = await res.json();
        Object.entries(d).forEach(([lang, b]) => { langBytes[lang] = (langBytes[lang] ?? 0) + b; });
      } catch { /**/ }
    })
  );

  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
  const langs: LangStats[] = Object.entries(langBytes)
    .map(([name, bytes]) => ({ name, bytes, percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0 }))
    .sort((a, b) => b.bytes - a.bytes).slice(0, 7);

  const data: GitHubData = { user, repos, pinnedRepos, langs, totalStars, totalForks, fetchedAt: Date.now() };
  return data;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useAnimatedNumber(target: number, trigger: boolean, duration = 900) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  useEffect(() => {
    if (!trigger) return;
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, trigger, duration]);
  return val;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, delay, trigger, color }: {
  icon: React.ElementType; label: string; value: number;
  delay: number; trigger: boolean; color: string;
}) {
  const animated = useAnimatedNumber(value, trigger, 900 + delay);
  return (
    <div className="group relative flex flex-col gap-2 p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}0a 0%, transparent 70%)` }} />
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">{label}</span>
      </div>
      <span className="text-2xl font-black font-mono tabular-nums text-foreground">{animated.toLocaleString()}</span>
    </div>
  );
}

// ─── Language bar ─────────────────────────────────────────────────────────────
function LangBar({ langs, visible }: { langs: LangStats[]; visible: boolean }) {
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden gap-px mb-4">
        {langs.map((l, i) => (
          <div key={l.name} className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
            style={{ width: visible ? `${l.percentage}%` : '0%', backgroundColor: getLangColor(l.name), transitionDelay: `${i * 60}ms` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {langs.map(l => (
          <div key={l.name} className="flex items-center gap-1.5 group cursor-default">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
              style={{ backgroundColor: getLangColor(l.name) }} />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">{l.name}</span>
            <span className="text-[10px] text-muted-foreground/50 font-mono">{l.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pinned repo card ─────────────────────────────────────────────────────────
function PinnedRepoCard({ repo, delay, visible }: { repo: PinnedRepo; delay: number; visible: boolean }) {
  return (
    <a href={repo.link} target="_blank" rel="noopener noreferrer"
      className="group flex flex-col gap-2.5 p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, border-color 0.3s, background-color 0.3s`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {repo.repo}
          </span>
        </div>
        <ExternalLink className="w-3 h-3 text-muted-foreground/40 flex-shrink-0 group-hover:text-primary transition-colors duration-200 mt-0.5" />
      </div>
      {repo.description && (
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-3 mt-auto">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: repo.languageColor || getLangColor(repo.language) }} />
            <span className="text-[10px] text-muted-foreground">{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Star className="w-3 h-3" />
          <span className="text-[10px] font-mono">{repo.stars}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <GitFork className="w-3 h-3" />
          <span className="text-[10px] font-mono">{repo.forks}</span>
        </div>
      </div>
    </a>
  );
}

// ─── Contribution graph (real, synced from GitHub) ────────────────────────────
// ghchart.rshah.org fetches contribution data directly from GitHub and
// returns an SVG that updates every time you commit — no token needed.
function ContribChart({ username }: { username: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  // Cache-bust once per hour so the chart refreshes without a page reload
  const cacheBust = Math.floor(Date.now() / (60 * 60 * 1_000));
  const src = `https://ghchart.rshah.org/${username}?v=${cacheBust}`;

  return (
    <div className="relative w-full overflow-x-auto">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center min-h-[80px]">
          <div className="w-6 h-6 rounded-full border-2 border-t-primary border-primary/20 animate-spin" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground/60 text-xs">
          <Github className="w-4 h-4" />
          <span>Could not load contribution chart</span>
        </div>
      )}
      {/* Use GitHub's own green palette — invert the SVG background to dark,
          then apply a green tint that matches GitHub's contribution colors */}
      <img
        src={src}
        alt={`${username} GitHub contribution chart`}
        className="w-full min-w-[600px]"
        style={{
          display: loaded || error ? (error ? 'none' : 'block') : 'none',
          // Invert to dark background, then shift hue to GitHub green (#39d353)
          filter: 'invert(1) hue-rotate(100deg) saturate(1.2) brightness(0.85)',
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const GitHubStats = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.05, true);
  const [data,          setData]          = useState<GitHubData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [isRefreshing,  setIsRefreshing]  = useState(false);
  const [statsTriggered,setStatsTriggered]= useState(false);
  const [activeTab,     setActiveTab]     = useState<'overview' | 'repos' | 'langs'>('overview');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await fetchGitHubData()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, []);

  // Fetch fresh setiap kali halaman dibuka
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (isVisible && data && !statsTriggered)
      setTimeout(() => setStatsTriggered(true), 200);
  }, [isVisible, data, statsTriggered]);

  const handleRefresh = async () => {
    setIsRefreshing(true); setStatsTriggered(false);
    await load();
    setTimeout(() => { setIsRefreshing(false); setStatsTriggered(true); }, 400);
  };

  const memberSince = data?.user.created_at ? new Date(data.user.created_at).getFullYear() : null;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)' }} />
      </div>

      <div className="container max-w-5xl px-4 mx-auto">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Github className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Open Source</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            GitHub <span className="text-gradient">Activity</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Live data from my GitHub profile.
          </p>
        </div>

        {/* Card shell */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center justify-between bg-muted/50 border-b border-border px-1">
              <div className="flex items-center">
                {(['overview', 'repos', 'langs'] as const).map(tab => {
                  const icons   = { overview: TrendingUp, repos: Star, langs: Code2 };
                  const labels  = { overview: 'overview.ts', repos: 'starred.ts', langs: 'languages.ts' };
                  const Icon    = icons[tab];
                  return (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-r border-border whitespace-nowrap transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-card text-primary border-b-2 border-b-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                      }`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs hidden sm:inline">{labels[tab]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 px-3">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">Live</span>
                </div>
                <button onClick={handleRefresh} disabled={loading || isRefreshing}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 disabled:opacity-40"
                  title="Refresh">
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && !data && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 rounded-full border-2 border-t-primary border-primary/10 animate-spin" />
                  <Github className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">Loading GitHub data…</p>
              </div>
            )}

            {/* Error */}
            {error && !data && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
                <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <Github className="w-6 h-6 text-destructive/60" />
                </div>
                <div>
                  <p className="text-foreground font-semibold mb-1">Failed to load GitHub stats</p>
                  <p className="text-muted-foreground text-sm">{error}</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">GitHub API rate limit: 60 requests/hour</p>
                </div>
                <button onClick={() => load()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Try Again
                </button>
              </div>
            )}

            {/* Data tabs */}
            {data && (
              <>
                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                  <div className="p-5 md:p-7 space-y-7">

                    {/* Profile strip */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
                      <img src={data.user.avatar_url} alt={data.user.login}
                        className="w-14 h-14 rounded-full border-2 border-primary/30 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground text-base">{data.user.name || data.user.login}</span>
                          <span className="text-xs text-muted-foreground font-mono">@{data.user.login}</span>
                          {memberSince && (
                            <span className="text-[10px] text-muted-foreground/60 border border-border/40 px-1.5 py-0.5 rounded-full">
                              Since {memberSince}
                            </span>
                          )}
                        </div>
                        {data.user.bio && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{data.user.bio}</p>}
                      </div>
                      <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200">
                        <Github className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Profile</span>
                      </a>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatCard icon={BookOpen} label="Repos"     value={data.user.public_repos} delay={0}   trigger={statsTriggered} color="hsl(var(--primary))" />
                      <StatCard icon={Star}      label="Stars"     value={data.totalStars}         delay={80}  trigger={statsTriggered} color="#f1e05a" />
                      <StatCard icon={GitFork}   label="Forks"     value={data.totalForks}         delay={160} trigger={statsTriggered} color="#58a6ff" />
                      <StatCard icon={Users}     label="Followers" value={data.user.followers}     delay={240} trigger={statsTriggered} color="#3fb950" />
                    </div>

                    {/* ── REAL Contribution graph (synced to GitHub) ── */}
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-4 md:p-5 overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">Contribution Activity</span>
                        </div>
                        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-primary transition-colors duration-200">
                          <ExternalLink className="w-2.5 h-2.5" />
                          View on GitHub
                        </a>
                      </div>
                      {/* ghchart.rshah.org fetches real contribution data from GitHub */}
                      <ContribChart username={GITHUB_USERNAME} />
                    </div>

                    {/* GitHub readme-stats embed (auto-updates on every push) */}
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">GitHub Stats Cards</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-lg overflow-hidden border border-border/30 bg-card/40">
                          <img
                            src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&theme=transparent&locale=en&hide_border=true&text_color=888888&icon_color=888888&title_color=cccccc`}
                            alt="GitHub Stats" className="w-full h-auto" loading="lazy"
                          />
                        </div>
                        <div className="rounded-lg overflow-hidden border border-border/30 bg-card/40">
                          <img
                            src={`https://streak-stats.demolab.com?user=${GITHUB_USERNAME}&locale=en&mode=daily&theme=transparent&hide_border=true&border_radius=0&background=00000000&ring=888888&fire=ff6b35&currStreakLabel=888888&sideLabels=888888&dates=888888&currStreakNum=cccccc&sideNums=cccccc`}
                            alt="GitHub Streak" className="w-full h-auto" loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PINNED REPOS TAB ── */}
                {activeTab === 'repos' && (
                  <div className="p-5 md:p-7">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Pin className="w-3.5 h-3.5 text-primary" />
                          Starred Repositories
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 ml-5">
                          {data.pinnedRepos.length > 0
                            ? `${data.pinnedRepos.length} starred repos from GitHub`
                            : 'Showing top repos by stars (fallback)'}
                        </p>
                      </div>
                      <a href={`https://github.com/${GITHUB_USERNAME}?tab=stars`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
                        View starred
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.pinnedRepos.map((repo, i) => (
                        <PinnedRepoCard key={`${repo.owner}/${repo.repo}`} repo={repo} delay={i * 80} visible={activeTab === 'repos'} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── LANGS TAB ── */}
                {activeTab === 'langs' && (
                  <div className="p-5 md:p-7">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Language Breakdown</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Across top repositories by byte count</p>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-border/30 bg-card/40 p-0.5">
                        <img
                          src={`https://github-readme-stats.vercel.app/api/top-langs?username=${GITHUB_USERNAME}&locale=en&hide_title=false&layout=compact&card_width=240&langs_count=6&theme=transparent&hide_border=true&text_color=888888&title_color=cccccc`}
                          alt="Top Languages" className="h-24 w-auto" loading="lazy"
                        />
                      </div>
                    </div>

                    {data.langs.length > 0 ? (
                      <>
                        <LangBar langs={data.langs} visible={activeTab === 'langs'} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                          {data.langs.map((lang, i) => (
                            <div key={lang.name}
                              className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-muted/20 hover:border-primary/20 hover:bg-muted/30 transition-all duration-300 group"
                              style={{
                                opacity: activeTab === 'langs' ? 1 : 0,
                                transform: activeTab === 'langs' ? 'translateY(0)' : 'translateY(10px)',
                                transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: getLangColor(lang.name) + '22' }}>
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getLangColor(lang.name) }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-sm font-semibold text-foreground">{lang.name}</span>
                                  <span className="text-xs font-mono text-muted-foreground">{lang.percentage}%</span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-700"
                                    style={{
                                      width: activeTab === 'langs' ? `${lang.percentage}%` : '0%',
                                      backgroundColor: getLangColor(lang.name),
                                      transitionDelay: `${i * 60 + 200}ms`,
                                    }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-8">No language data available</p>
                    )}
                  </div>
                )}

                {/* Status bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t border-border text-[10px] md:text-[11px] font-mono text-muted-foreground/50">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Connected · GitHub REST API
                    </span>
                    <span className="hidden sm:inline">@{data.user.login}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>Updated {new Date(data.fetchedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>v3</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubStats;