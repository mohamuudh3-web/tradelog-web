import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Download,
  ExternalLink,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  LineChart,
  LogOut,
  Mail,
  NotebookTabs,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  WalletCards,
  X,
} from 'lucide-react'
import { supabase } from './supabase.js'

const tableConfigs = {
  trades: {
    title: 'Trades',
    icon: LineChart,
    table: 'trades',
    hasCreated: true,
    order: 'opened_at',
    empty: 'Log your first trade from Chrome.',
    fields: [
      ['instrument', 'Instrument', 'text', 'EURUSD'],
      ['direction', 'Direction', 'select', ['LONG', 'SHORT']],
      ['account_uid', 'Account', 'account'],
      ['session', 'Session', 'select', ['', 'ASIA', 'LONDON', 'NEW YORK']],
      ['result', 'Result', 'select', ['WIN', 'LOSS', 'BREAKEVEN']],
      ['entry_price', 'Entry price', 'number'],
      ['exit_price', 'Exit price', 'number'],
      ['lot_size', 'Lot size', 'number'],
      ['risk_percent', 'Risk %', 'number'],
      ['r_multiple', 'R multiple', 'number'],
      ['pnl', 'P&L', 'number'],
      ['setup_tag', 'Setup tag', 'text', 'Liquidity sweep'],
      ['psychology', 'Psychology', 'textarea', 'Calm execution, waited for confirmation.'],
      ['notes', 'Notes', 'textarea'],
      ['screenshot_url', 'Screenshot URL', 'image'],
    ],
    defaults: { direction: 'LONG', result: 'BREAKEVEN', opened_at: Date.now() },
  },
  backtests: {
    title: 'Backtests',
    icon: BarChart3,
    table: 'backtests',
    hasCreated: true,
    order: 'date_millis',
    empty: 'Save your first backtest with chart screenshots.',
    fields: [
      ['title', 'Title', 'text', 'London continuation model'],
      ['instrument', 'Instrument', 'text', 'GBPUSD'],
      ['date_millis', 'Date', 'date'],
      ['bias', 'Bias', 'text', 'Bullish after sweep'],
      ['direction', 'Direction', 'select', ['', 'LONG', 'SHORT']],
      ['result', 'Result', 'select', ['', 'WIN', 'LOSS', 'BREAKEVEN']],
      ['session', 'Scenario / session', 'text', 'S2 London'],
      ['sl_pips', 'SL pips', 'number'],
      ['tp_pips', 'TP pips', 'number'],
      ['chart5_url', '5M chart URL', 'image'],
      ['chart15_url', '15M chart URL', 'image'],
      ['notes', 'Notes', 'textarea'],
    ],
    defaults: { date_millis: Date.now() },
  },
  accounts: {
    title: 'Accounts',
    icon: WalletCards,
    table: 'accounts',
    hasCreated: true,
    order: 'updated_at',
    empty: 'Add a personal or prop-firm account.',
    fields: [
      ['name', 'Account name', 'text', 'Phase 1 Challenge'],
      ['broker', 'Broker / firm', 'text', 'FTMO'],
      ['balance', 'Balance', 'number'],
      ['currency', 'Currency', 'select', ['USD', 'GBP', 'EUR']],
      ['is_prop_firm', 'Prop firm', 'checkbox'],
      ['challenge_phase', 'Challenge phase', 'text', 'Evaluation'],
      ['status', 'Status', 'select', ['', 'ACTIVE', 'PASSED', 'FAILED', 'PAUSED']],
      ['website', 'Website', 'text', 'https://'],
      ['starting_balance', 'Starting balance', 'number'],
      ['split_percent', 'Split %', 'number'],
      ['drawdown_percent', 'Drawdown %', 'number'],
      ['target_percent', 'Target %', 'number'],
    ],
    defaults: { currency: 'USD', is_prop_firm: false },
  },
  payouts: {
    title: 'Payouts',
    icon: CircleDollarSign,
    table: 'payouts',
    hasCreated: true,
    order: 'updated_at',
    empty: 'Track pending and paid withdrawals.',
    fields: [
      ['date', 'Date', 'dateText'],
      ['account_name', 'Account', 'text', 'Funded account'],
      ['amount', 'Amount', 'number'],
      ['currency', 'Currency', 'select', ['USD', 'GBP', 'EUR']],
      ['status', 'Status', 'select', ['PENDING', 'PAID', 'REJECTED']],
      ['notes', 'Notes', 'textarea'],
    ],
    defaults: { currency: 'USD', status: 'PENDING' },
  },
  journal_entries: {
    title: 'Journal',
    icon: BookOpen,
    table: 'journal_entries',
    hasCreated: true,
    order: 'updated_at',
    empty: 'Write today’s mindset and review.',
    fields: [
      ['date', 'Date', 'dateText'],
      ['title', 'Title', 'text', 'London session review'],
      ['mindset', 'Mindset', 'textarea'],
      ['routine', 'Routine', 'textarea'],
      ['reflection', 'Reflection', 'textarea'],
      ['mood', 'Mood 1-5', 'number'],
      ['discipline', 'Discipline 1-5', 'number'],
      ['gratitude', 'Gratitude', 'textarea'],
      ['battle_plan', 'Battle plan', 'textarea'],
      ['affirmation', 'Affirmation', 'textarea'],
      ['tags', 'Tags', 'text', 'discipline, london'],
    ],
    defaults: { mood: 3, discipline: 3 },
  },
  notes: {
    title: 'Notebook',
    icon: NotebookTabs,
    table: 'notes',
    order: 'updated_at',
    empty: 'Save rules, models, and lessons.',
    fields: [
      ['title', 'Title', 'text', 'A+ setup rules'],
      ['body', 'Body', 'textarea'],
      ['tags', 'Tags', 'text', 'rules, entry'],
    ],
    defaults: {},
  },
}

const navSections = [
  {
    title: 'Platform',
    items: [
      ['dashboard', 'Dashboard', LayoutDashboard],
      ['journal_entries', 'Daily Journal', BookOpen],
      ['trades', 'Trading Journal', LineChart],
      ['accounts', 'My Portfolio', WalletCards],
      ['notes', 'Notebook', NotebookTabs],
      ['analytics', 'Analytics', BarChart3],
    ],
  },
  {
    title: 'Tools',
    items: [
      ['calendar', 'Economic Calendar', Globe2],
      ['tools', 'Position Calculator', Calculator],
      ['coupons', 'Coupons', Tag],
    ],
  },
  {
    title: 'Backtesting Area',
    items: [
      ['backtests', 'Backtested Trades', TrendingUp],
      ['statistics', 'Statistics Center', BarChart3],
    ],
  },
  {
    title: 'Payouts',
    items: [['payouts', 'Payout Journal', CircleDollarSign]],
  },
]

const navItems = navSections.flatMap((section) => section.items)

const modules = [
  ['Dashboard', 'A focused command center for P&L, win rate, recent trades, and sync health.', LayoutDashboard],
  ['Trading Journal', 'Log entries, exits, R multiple, rules, psychology, notes, and screenshots.', LineChart],
  ['Backtesting', 'Store 5M and 15M chart images with scenario notes and outcome tracking.', BarChart3],
  ['Portfolio', 'Track account balances, prop-firm phases, drawdown targets, and status.', WalletCards],
  ['Payouts', 'Record pending and paid withdrawals so your trading business has clean history.', CircleDollarSign],
  ['Notebook', 'Keep models, mistakes, checklists, and strategy notes beside your data.', NotebookTabs],
]

function uid() {
  return crypto.randomUUID()
}

function msNow() {
  return Date.now()
}

function money(value, currency = 'USD') {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 ? 2 : 0,
  }).format(amount)
}

function toDateInput(ms) {
  if (!ms) return new Date().toISOString().slice(0, 10)
  return new Date(Number(ms)).toISOString().slice(0, 10)
}

function parseValue(type, value) {
  if (type === 'number') return value === '' ? null : Number(value)
  if (type === 'checkbox') return Boolean(value)
  if (type === 'date') return value ? new Date(`${value}T12:00:00`).getTime() : msNow()
  return value ?? ''
}

const maxImageUploadBytes = 8 * 1024 * 1024

const tradeChecklist = [
  'Soo hel Trend-ka (H1/H4 for S1) (15M for S2/S3) (5M for S4)',
  'Soo hel Zone-ka maamulka Order Flow-ga suuqa.',
  'Sug in Liquidity-ga lagu jebiyo Reversal Volume muuqda.',
  'Hubi in Volume-ka uu keeno Countertrend Break.',
  'Hubi in Momentum-ku la jaanqaadayo direction-ka.',
]

const psychologyOptions = [
  'Calm',
  'Patient',
  'Focused',
  'FOMO',
  'Fear',
  'Greed',
  'Hesitation',
  'Overconfident',
  'Revenge',
  'Rule break',
]

const dashboardRanges = ['30 days', '60 days', '90 days', 'All', 'Today']

const calendarCurrencyPresets = ['USD,EUR,GBP,JPY', 'USD', 'EUR,GBP', 'AUD,NZD,CAD']

const myfxbookCalendarUrl = 'https://www.myfxbook.com/forex-economic-calendar'

function safeImageUrl(value) {
  if (!value) return ''
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export default function App() {
  const [session, setSession] = useState(null)
  const [booting, setBooting] = useState(true)
  const [view, setView] = useState('dashboard')
  const [records, setRecords] = useState({})
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [authMode, setAuthMode] = useState('signin')
  const [celebration, setCelebration] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setBooting(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setBooting(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) refreshAll()
  }, [session])

  useEffect(() => {
    if (!celebration) return undefined
    const timer = setTimeout(() => setCelebration(null), 3600)
    return () => clearTimeout(timer)
  }, [celebration])

  // Live-ish sync: pull fresh cloud data on a timer and whenever the tab regains focus,
  // so trades logged on the phone show up here without pressing Refresh.
  useEffect(() => {
    if (!session) return undefined
    const tick = () => { if (document.visibilityState === 'visible') refreshAll() }
    const id = setInterval(tick, 20000)
    window.addEventListener('focus', tick)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', tick)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [session])

  async function refreshAll() {
    setLoading(true)
    const entries = await Promise.all(
      Object.entries(tableConfigs).map(async ([key, config]) => {
        const { data, error } = await supabase
          .from(config.table)
          .select('*')
          .eq('deleted', false)
          .order(config.order, { ascending: false })
        return [key, error ? [] : data]
      }),
    )
    setRecords(Object.fromEntries(entries))
    setLoading(false)
  }

  async function uploadImage(file) {
    if (!file) return ''
    if (!file.type.startsWith('image/')) throw new Error('Only image uploads are allowed.')
    if (file.size > maxImageUploadBytes) throw new Error('Image uploads must be 8 MB or smaller.')
    const ext = file.name.split('.').pop() || 'jpg'
    const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'jpg'
    const path = `${session.user.id}/${uid()}.${safeExt}`
    const { error } = await supabase.storage.from('screenshots').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
    if (error) throw new Error(error.message)
    return supabase.storage.from('screenshots').getPublicUrl(path).data.publicUrl
  }

  async function saveRecord(configKey, values, editUid) {
    const config = tableConfigs[configKey]
    const payload = { ...values, updated_at: msNow() }
    if (configKey === 'trades') {
      // Sign P&L and R by outcome so a loss is always negative (matches the Android app).
      const sign = payload.result === 'LOSS' ? -1 : payload.result === 'BREAKEVEN' ? 0 : 1
      if (payload.pnl != null && payload.pnl !== '') payload.pnl = Math.abs(Number(payload.pnl) || 0) * sign
      if (payload.r_multiple != null && payload.r_multiple !== '') payload.r_multiple = Math.abs(Number(payload.r_multiple) || 0) * sign
    }
    if (!editUid) {
      payload.uid = uid()
      if (config.hasCreated) payload.created_at = msNow()
    }
    const request = editUid
      ? supabase.from(config.table).update(payload).eq('uid', editUid)
      : supabase.from(config.table).insert([payload])
    const { error } = await request
    if (error) throw new Error(error.message)
    setModal(null)
    if ((configKey === 'trades' || configKey === 'backtests') && payload.result === 'WIN') {
      setCelebration({
        title: configKey === 'trades' ? 'Winning trade logged' : 'Winning backtest saved',
        copy: configKey === 'trades' ? 'Execution recorded. Review it, repeat it, refine it.' : 'Model evidence saved. Keep stacking quality reps.',
      })
    }
    await refreshAll()
  }

  async function deleteRecord(configKey, rowUid) {
    const config = tableConfigs[configKey]
    const { error } = await supabase
      .from(config.table)
      .update({ deleted: true, updated_at: msNow() })
      .eq('uid', rowUid)
    if (error) throw new Error(error.message)
    await refreshAll()
  }

  async function signOut() {
    await supabase.auth.signOut()
    setView('dashboard')
  }

  if (booting) return <div className="boot">TradeLog</div>

  return (
    <>
      {!session ? (
        <Landing authMode={authMode} setAuthMode={setAuthMode} />
      ) : (
        <Workspace
          session={session}
          view={view}
          setView={setView}
          records={records}
          loading={loading}
          refreshAll={refreshAll}
          signOut={signOut}
          openModal={setModal}
          deleteRecord={deleteRecord}
        />
      )}
      {modal && (
        <RecordModal
          modal={modal}
          close={() => setModal(null)}
          uploadImage={uploadImage}
          saveRecord={saveRecord}
          accounts={records.accounts || []}
        />
      )}
      {celebration && <Celebration title={celebration.title} copy={celebration.copy} />}
    </>
  )
}

function Landing({ authMode, setAuthMode }) {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <main className="site-shell">
      <SiteNav onLaunch={() => setShowAuth(true)} />
      <section className="hero-grid section" id="top">
        <div className="hero-copy">
          <h1>
            Master your trading with <span>disciplined data.</span>
          </h1>
          <p>
            Log trades, backtests, payouts, journals, and screenshots in one synced command
            center built for the Android app you already use.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => setShowAuth(true)}>
              Launch Logger <ChevronRight size={17} />
            </button>
            <a className="btn ghost" href="#modules">
              View Demo
            </a>
          </div>
          <div className="hero-proof">
            <span><Check size={13} /> Supabase sync</span>
            <span><Check size={13} /> Android-ready schema</span>
            <span><Check size={13} /> Screenshot storage</span>
          </div>
        </div>
        <DashboardPreview />
      </section>
      <Ticker />
      <section className="mission section">
        <p>
          An <em>all-in-one journal</em> where traders track execution, review behavior, manage
          accounts, and turn screenshots into repeatable feedback loops.
        </p>
      </section>
      <section className="split section">
        <InfoPanel
          index="01"
          title="Process first."
          copy="TradeLog is built around discipline: pre-session plan, execution record, screenshot evidence, and honest review."
          chips={['Routine', 'Rules', 'Reflection']}
        />
        <InfoPanel
          index="02"
          title="Cloud when needed."
          copy="Your Android app remains offline-first while the web logger writes to the same Supabase tables for later sync."
          chips={['Supabase', 'Storage', 'Android sync']}
          active
        />
      </section>
      <section className="section modules" id="modules">
        <SectionTitle kicker="Core Platform" title="Everything TradeLog needs, in one place." />
        <div className="module-grid">
          {modules.map(([title, copy, Icon]) => (
            <article className="module-card" key={title}>
              <Icon size={20} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section tool-band" id="tools">
        <div>
          <SectionTitle kicker="Trading Tools" title="Sharper execution, every session." />
        </div>
        <div className="tool-list">
          <MiniRow icon={Calculator} title="Position Calculator" copy="Risk, stop loss, pip value, and lot size without leaving the journal." />
          <MiniRow icon={CalendarDays} title="Economic Calendar" copy="Keep the mobile calendar workflow aligned with your session notes." />
          <MiniRow icon={Upload} title="Screenshot Uploads" copy="Chart screenshots are stored in Supabase Storage and shown on both sides." />
        </div>
      </section>
      <section className="split section" id="payouts">
        <InfoPanel
          index="03"
          title="Payout clarity."
          copy="Track pending withdrawals, paid payouts, account names, notes, and currency so funded-account history stays clean."
          chips={['Paid', 'Pending', 'Proof']}
        />
        <InfoPanel
          index="04"
          title="Backtest receipts."
          copy="Attach 5M and 15M chart screenshots to every model, then review the scenario, direction, result, and lessons."
          chips={['5M chart', '15M chart', 'Scenario']}
          active
        />
      </section>
      <section className="section pricing" id="pricing">
        <SectionTitle kicker="Pricing" title="Built for your personal trading stack." />
        <div className="pricing-card">
          <div>
            <h3>Personal Cloud Logger</h3>
            <p>One Supabase account, one Android app, one web dashboard.</p>
          </div>
          <strong>Ready</strong>
          <button className="btn primary" onClick={() => setShowAuth(true)}>
            Launch Logger
          </button>
        </div>
      </section>
      <footer className="footer">
        <Logo />
        <span>Trading journal • Backtesting • Payouts • Android sync</span>
      </footer>
      {showAuth && <AuthDialog mode={authMode} setMode={setAuthMode} close={() => setShowAuth(false)} />}
    </main>
  )
}

function SiteNav({ onLaunch }) {
  return (
    <header className="site-nav">
      <Logo />
      <nav>
        <a href="#modules">Platform</a>
        <a href="#tools">Tools</a>
        <a href="#payouts">Payouts</a>
        <a href="#payouts">Backtests</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <button className="icon-btn" aria-label="Sync status">
        <Cloud size={16} />
      </button>
      <button className="nav-demo" onClick={onLaunch}>Demo</button>
      <button className="btn primary small" onClick={onLaunch}>
        Get Started <ChevronRight size={15} />
      </button>
    </header>
  )
}

function Logo() {
  return (
    <a className="logo" href="#top">
      <span className="logo-mark"><Activity size={18} /></span>
      <span>TradeLog</span>
    </a>
  )
}

function DashboardPreview() {
  const heat = [4, -1, 2, 0, 6, -3, 1, 3, 0, -2, 5, 2, 1, -1, 4, 7, -2, 0, 3, 1]
  return (
    <div className="preview-shell">
      <div className="window-bar">
        <span />
        <span />
        <span />
        <strong>app.tradelog / dashboard</strong>
      </div>
      <div className="preview-app">
        <aside>
          <Logo />
          {navItems.slice(0, 7).map(([key, label, Icon]) => (
            <span className={key === 'dashboard' ? 'active' : ''} key={key}>
              <Icon size={14} /> {label}
            </span>
          ))}
          <small><Smartphone size={12} /> Synced to Android</small>
        </aside>
        <div className="preview-main">
          <div className="preview-hero">
            <span>OVERVIEW</span>
            <h2>Welcome back, Demo</h2>
            <p>Track performance, review trading, and stay aligned with your edge.</p>
          </div>
          <div className="metric-grid">
            <Metric label="Total P&L" value="+$18,420" />
            <Metric label="Win Rate" value="68%" />
            <Metric label="Avg R" value="1.42" />
            <Metric label="Open Risk" value="1.8%" />
          </div>
          <div className="preview-bottom">
            <div className="heatmap">
              <div className="heat-head">
                <b>June 2026</b>
                <span>Trade heatmap</span>
              </div>
              <div className="heat-grid">
                {heat.map((v, index) => (
                  <span className={v > 0 ? 'win' : v < 0 ? 'loss' : ''} key={index}>
                    {index + 1}
                  </span>
                ))}
              </div>
            </div>
            <div className="trade-feed">
              <MiniTrade result="+2.1R" pair="EURUSD Long" />
              <MiniTrade result="-0.7R" pair="GBPUSD Short" loss />
              <div className="upload-state"><ImagePlus size={16} /> Screenshot attached</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MiniTrade({ pair, result, loss }) {
  return (
    <div className="mini-trade">
      <span>{pair}</span>
      <b className={loss ? 'negative' : ''}>{result}</b>
    </div>
  )
}

function Ticker() {
  const items = ['Discipline', 'Clarity', 'Edge', 'Consistency', 'Reflection', 'Process', 'Patience']
  return (
    <div className="ticker" aria-hidden="true">
      {[...items, ...items, ...items].map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  )
}

function InfoPanel({ index, title, copy, chips, active }) {
  return (
    <article className={`info-panel ${active ? 'active' : ''}`}>
      <div className="panel-index">{index}</div>
      <h3>{title}</h3>
      <p>{copy}</p>
      <div>{chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
    </article>
  )
}

function SectionTitle({ kicker, title }) {
  return (
    <div className="section-title">
      <span>{kicker}</span>
      <h2>{title}</h2>
    </div>
  )
}

function MiniRow({ icon: Icon, title, copy }) {
  return (
    <article className="mini-row">
      <Icon size={20} />
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </article>
  )
}

function AuthDialog({ mode, setMode, close }) {
  const [email, setEmail] = useState('mohamuudh3@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const isSignUp = mode === 'signup'

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const request = isSignUp
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password })
    const { error: authError } = await request
    setSubmitting(false)
    if (authError) setError(authError.message)
    else close()
  }

  async function signInWithGoogle() {
    setError('')
    setOauthLoading(true)
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (authError) {
      setError(authError.message)
      setOauthLoading(false)
    }
  }

  return (
    <div className="dialog-backdrop">
      <form className="auth-dialog" onSubmit={submit}>
        <button type="button" className="close" onClick={close} aria-label="Close">
          <X size={18} />
        </button>
        <Logo />
        <h2>{isSignUp ? 'Create your TradeLog account' : 'Launch your logger'}</h2>
        <p>Sign in with Gmail or the Supabase email/password user created for Android sync.</p>
        <div className="auth-methods">
          <button type="button" className="google-auth" onClick={signInWithGoogle} disabled={oauthLoading}>
            <Mail size={17} />
            {oauthLoading ? 'Opening Google...' : 'Continue with Google'}
          </button>
          <span>or continue with email</span>
        </div>
        <div className="auth-fields">
          <label>
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </label>
          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </label>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn primary wide" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
        <button
          type="button"
          className="switch-auth"
          onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
        >
          {isSignUp ? 'I already have an account' : 'Need a new account?'}
        </button>
      </form>
    </div>
  )
}

function Celebration({ title, copy }) {
  return (
    <div className="celebration-overlay" aria-live="polite">
      <div className="celebration-card">
        <div className="confetti-field" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} style={{ '--i': index }} />
          ))}
        </div>
        <strong>WIN</strong>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </div>
  )
}

function Workspace({
  session,
  view,
  setView,
  records,
  loading,
  refreshAll,
  signOut,
  openModal,
  deleteRecord,
}) {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  function navigate(key) {
    setView(key)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  return (
    <div className="workspace">
      <aside className="app-sidebar">
        <Logo />
        <nav className="side-nav">
          {navSections.map((section) => (
            <div className="nav-group" key={section.title}>
              <span>{section.title}</span>
              {section.items.map(([key, label, Icon]) => (
                <button className={view === key ? 'active' : ''} onClick={() => navigate(key)} key={key}>
                  <Icon size={17} /> {label}
                  {view === key && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sync-card">
          <span className="user-dot">{session.user.email?.slice(0, 1).toUpperCase()}</span>
          <div>
            <b>{session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'BlacK X'}</b>
            <span>Email / Google auth ready</span>
          </div>
          <span className="profile-dots">•••</span>
        </div>
      </aside>
      <main className="app-main">
        <header className="app-topbar">
          <div>
            <h1>{pageMeta(view).topTitle}</h1>
            <p>{pageMeta(view).topCopy}</p>
          </div>
          <div className="session-date">
            <CalendarDays size={16} />
            <span>Session Date</span>
            <b>{today}</b>
          </div>
          <div className="topbar-actions">
            <button className="btn ghost" onClick={refreshAll}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn ghost" onClick={signOut}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </header>
        {loading && <div className="loading-line" />}
        {view === 'dashboard' ? (
          <CloudDashboard
            records={records}
            openModal={openModal}
            setView={setView}
            userName={session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Trader'}
          />
        ) : view === 'analytics' ? (
          <AnalyticsDashboard records={records} />
        ) : view === 'tools' ? (
          <ToolsPanel />
        ) : view === 'calendar' ? (
          <EconomicCalendarPanel />
        ) : view === 'coupons' ? (
          <CouponsPanel />
        ) : view === 'statistics' ? (
          <StatisticsCenter records={records} setView={setView} />
        ) : view === 'trades' ? (
          <TradingJournalView
            records={records.trades || []}
            openModal={openModal}
            deleteRecord={deleteRecord}
          />
        ) : (
          <RecordsView
            configKey={view}
            records={records[view] || []}
            openModal={openModal}
            deleteRecord={deleteRecord}
          />
        )}
      </main>
    </div>
  )
}

function pageMeta(view) {
  const map = {
    dashboard: ['Trading Command Center', 'Track performance, review timing, and stay aligned with your edge.'],
    trades: ['Trading Journal Archive', 'Filter, compare, and review your complete execution history.'],
    analytics: ['Analytics Center', 'Break down performance by setup, session, and behavioral pattern.'],
    journal_entries: ['Daily Journal', 'Review mindset, routine, discipline, and session reflection.'],
    accounts: ['Portfolio Center', 'Monitor balances, prop-firm targets, phases, and drawdown status.'],
    notes: ['Notebook', 'Keep strategy rules, lessons, checklists, and playbooks organized.'],
    backtests: ['Backtesting Area', 'Review model screenshots, scenarios, and execution evidence.'],
    payouts: ['Payout Center', 'Track payout status, account source, and withdrawal history.'],
    tools: ['Position Calculator', 'Calculate lot size and risk before entering the market.'],
    calendar: ['Economic Calendar', 'Track high-impact news from Myfxbook beside your journal.'],
    coupons: ['Coupons', 'Keep broker, prop-firm, and tool coupon notes in one place.'],
    statistics: ['Statistics Center', 'Backtesting and trading stats in a RyzeLog-style center.'],
  }
  const [topTitle, topCopy] = map[view] || ['TradeLog Cloud', 'Synchronized trading records.']
  return { topTitle, topCopy }
}

function CloudDashboard({ records, openModal, setView, userName = 'Trader' }) {
  const [range, setRange] = useState('30 days')
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const trades = records.trades || []
  const backtests = records.backtests || []
  const accounts = records.accounts || []
  const payouts = records.payouts || []
  const filteredTrades = useMemo(() => filterTradesByRange(trades, range), [trades, range])
  const totals = tradeTotals(filteredTrades, accounts, payouts)
  const accountBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0)
  const heatDays = monthHeatDays(filteredTrades, calendarDate)
  const weeks = weeklyPnl(filteredTrades, calendarDate)
  const weekday = weekdayPnl(filteredTrades)
  const equity = equityCurve(filteredTrades)

  function updateRange(nextRange) {
    setRange(nextRange)
    if (nextRange === 'Today') setCalendarDate(new Date())
  }

  function moveMonth(direction) {
    setCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  return (
    <div className="dashboard-layout">
      <section className="command-panel">
        <div>
          <span>OVERVIEW</span>
          <h2>Welcome back, {userName} 👋</h2>
          <p>Here is your trading performance at a glance.</p>
        </div>
        <button className="btn primary" onClick={() => openModal({ configKey: 'trades' })}>
          <Plus size={16} /> New trade
        </button>
      </section>
      <div className="stats-grid">
        <StatCard icon={BookOpen} label="Total Trades" value={filteredTrades.length} hint={range} tone="aqua" />
        <StatCard icon={Target} label="Win Rate" value={`${totals.winRate}%`} hint="Based on outcomes" tone="violet" />
        <StatCard icon={LineChart} label="Avg Risk:Reward" value={`1:${totals.avgR.toFixed(1)}`} hint="Average RR" tone="amber" />
        <StatCard icon={CircleDollarSign} label="Total PnL" value={money(totals.totalPnl)} hint={totals.totalPnl >= 0 ? 'Flat' : 'Drawdown'} tone="mint" trend={totals.totalPnl >= 0 ? 'positive' : 'negative'} />
      </div>
      <div className="range-strip">
        {dashboardRanges.map((item) => (
          <button
            className={range === item ? 'active' : ''}
            key={item}
            onClick={() => updateRange(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="glass-panel calendar-panel">
          <div className="panel-head">
            <h3>{monthTitle(calendarDate)}</h3>
            <div className="panel-arrows">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month">›</button>
            </div>
          </div>
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="month-grid">
            {heatDays.map((day) => (
              <span className={[day.outside ? 'outside' : day.pnl > 0 ? 'win' : day.pnl < 0 ? 'loss' : '', day.today ? 'today' : ''].filter(Boolean).join(' ')} key={day.key}>
                <b>{day.date}</b>
                {day.trades > 0 && <small>{money(day.pnl)}</small>}
              </span>
            ))}
          </div>
          <p className="muted-copy">Daily cells light up from real trade P&L once entries exist.</p>
        </section>
        <section className="glass-panel week-rail">
          <div className="panel-head">
            <h3>P&L By Week</h3>
          </div>
          <div className="week-list">
            {weeks.map((week) => (
              <div key={week.label}>
                <span>{week.label}</span>
                <b className={week.pnl < 0 ? 'negative' : ''}>{money(week.pnl)}</b>
                <small>{week.trades} Trades</small>
              </div>
            ))}
            <div className="monthly-total">
              <span>Monthly Total</span>
              <b>{money(weeks.reduce((sum, week) => sum + week.pnl, 0))}</b>
            </div>
          </div>
        </section>
      </div>
      <section className="analytics-preview">
        <div className="panel-head">
          <div>
            <span>Performance Analytics</span>
            <h3>Equity, timing, and review loop</h3>
          </div>
          <button onClick={() => setView('analytics')}>Open Analytics</button>
        </div>
        <div className="analytics-grid">
          <MiniChart title="Cumulative P&L" points={equity} />
          <BarPreview title="Performance by Day of Week" copy="Net P&L per weekday" items={weekday} />
          <section className="glass-panel">
            <div className="panel-head">
              <h3>Recent trades</h3>
              <button onClick={() => setView('trades')}>Open</button>
            </div>
            <RecordList rows={filteredTrades.slice(0, 4)} configKey="trades" compact />
          </section>
          <section className="glass-panel summary-stack">
            <div>
              <span>Backtested Trades</span>
              <strong>{backtests.length}</strong>
            </div>
            <div>
              <span>Account Balance</span>
              <strong>{money(accountBalance)}</strong>
            </div>
            <div>
              <span>Payout Value</span>
              <strong>{money(totals.totalPayouts)}</strong>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, hint, tone = 'aqua', trend }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div>
        {Icon && <Icon size={18} />}
        <span>{hint}</span>
      </div>
      <strong className={trend || ''}>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

function TradingJournalView({ records, openModal, deleteRecord }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All Status')
  const [grade, setGrade] = useState('All Grades')
  const [pair, setPair] = useState('All Pairs')
  const [period, setPeriod] = useState('All Time')
  const [showBanner, setShowBanner] = useState(true)
  const lowered = query.trim().toLowerCase()
  const pairs = [...new Set(records.map((row) => row.instrument).filter(Boolean))]
  const filtered = records.filter((row) => {
    const matchesQuery = !lowered || [row.instrument, row.notes, row.setup_tag].join(' ').toLowerCase().includes(lowered)
    const matchesStatus = status === 'All Status' || row.result === status
    const matchesGrade = grade === 'All Grades' || String(row.setup_tag || '').toUpperCase().includes(grade.toUpperCase())
    const matchesPair = pair === 'All Pairs' || row.instrument === pair
    const matchesPeriod = tradeInPeriod(row, period)
    return matchesQuery && matchesStatus && matchesGrade && matchesPair && matchesPeriod
  })
  const won = records.filter((row) => row.result === 'WIN').length
  const loss = records.filter((row) => row.result === 'LOSS').length
  const aPlus = records.filter((row) => String(row.setup_tag || '').toLowerCase().includes('a+')).length

  return (
    <section className="journal-shell">
      {showBanner && (
        <div className="trial-banner">
          <ShieldCheck size={16} />
          <span>Cloud sync active. Android app records can flow into this journal.</span>
          <button type="button" onClick={() => setShowBanner(false)} aria-label="Dismiss sync banner">×</button>
        </div>
      )}
      <div className="records-head journal-head">
        <div>
          <span>TRADING SETUP</span>
          <h2>Trade Journal</h2>
          <p>Track your day, A+ setups, psychology, and performance.</p>
        </div>
        <button className="btn primary" onClick={() => openModal({ configKey: 'trades' })}>
          <Plus size={16} /> Add Trade
        </button>
      </div>
      <div className="stats-grid journal-stats">
        <StatCard icon={BookOpen} label="Total Trades" value={records.length} tone="aqua" />
        <StatCard icon={LineChart} label="Won" value={won} tone="violet" />
        <StatCard icon={Target} label="Loss" value={loss} tone="amber" trend="negative" />
        <StatCard icon={ShieldCheck} label="A+ Trades" value={aPlus} tone="mint" />
      </div>
      <div className="journal-filters">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by pair or notes..." />
        <select value={grade} onChange={(event) => setGrade(event.target.value)}>
          <option>All Grades</option>
          <option>A+</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All Status</option>
          <option>WIN</option>
          <option>LOSS</option>
          <option>BREAKEVEN</option>
        </select>
        <select value={pair} onChange={(event) => setPair(event.target.value)}>
          <option>All Pairs</option>
          {pairs.map((item) => <option key={item}>{item}</option>)}
        </select>
        {['All Time', 'Last 7 days', 'Last 14 days', 'Last 30 days', 'Custom'].map((item) => (
          <button
            type="button"
            className={period === item ? 'active' : ''}
            key={item}
            onClick={() => setPeriod(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {!filtered.length ? (
        <div className="empty-state light-empty">
          <Check size={30} />
          <h3>No trades logged yet</h3>
          <p>Add your first trade to start your daily journal.</p>
          <button className="btn primary" onClick={() => openModal({ configKey: 'trades' })}>
            Add Trade
          </button>
        </div>
      ) : (
        <RecordList
          rows={filtered}
          configKey="trades"
          editRecord={(record) => openModal({ configKey: 'trades', record })}
          deleteRecord={deleteRecord}
        />
      )}
    </section>
  )
}

function AnalyticsDashboard({ records }) {
  const rawTrades = records.trades || []
  const accounts = records.accounts || []
  const rawPayouts = records.payouts || []
  const [filters, setFilters] = useState({
    account: 'All Accounts',
    symbol: 'All Symbols',
    session: 'All Sessions',
    start: '',
    end: '',
  })
  const [showBanner, setShowBanner] = useState(true)
  const [exportStatus, setExportStatus] = useState('')
  const accountOptions = [
    'All Accounts',
    ...new Set(accounts.map((account) => account.name || account.account_name || account.uid).filter(Boolean)),
  ]
  const symbolOptions = ['All Symbols', ...new Set(rawTrades.map((trade) => trade.instrument).filter(Boolean))]
  const sessionOptions = ['All Sessions', ...new Set(rawTrades.map((trade) => trade.session).filter(Boolean))]
  const trades = useMemo(() => {
    const start = filters.start ? new Date(`${filters.start}T00:00:00`).getTime() : null
    const end = filters.end ? new Date(`${filters.end}T23:59:59`).getTime() : null
    return rawTrades.filter((trade) => {
      const timestamp = tradeTime(trade)
      const tradeAccount = trade.account_name || trade.account || trade.account_uid || trade.account_id || 'Unassigned'
      const matchesAccount = filters.account === 'All Accounts' || tradeAccount === filters.account
      const matchesSymbol = filters.symbol === 'All Symbols' || trade.instrument === filters.symbol
      const matchesSession = filters.session === 'All Sessions' || trade.session === filters.session
      const matchesStart = !start || timestamp >= start
      const matchesEnd = !end || timestamp <= end
      return matchesAccount && matchesSymbol && matchesSession && matchesStart && matchesEnd
    })
  }, [rawTrades, filters])
  const payouts = useMemo(() => {
    const start = filters.start ? new Date(`${filters.start}T00:00:00`).getTime() : null
    const end = filters.end ? new Date(`${filters.end}T23:59:59`).getTime() : null
    return rawPayouts.filter((payout) => {
      const timestamp = payout.date ? new Date(`${payout.date}T12:00:00`).getTime() : Number(payout.updated_at || Date.now())
      const matchesAccount = filters.account === 'All Accounts' || payout.account_name === filters.account
      const matchesStart = !start || timestamp >= start
      const matchesEnd = !end || timestamp <= end
      return matchesAccount && matchesStart && matchesEnd
    })
  }, [rawPayouts, filters])
  const totals = tradeTotals(trades, accounts, payouts)
  const equity = equityCurve(trades)
  const sessionItems = groupPnl(trades, 'session', ['ASIA', 'LONDON', 'NEW YORK'])
  const symbols = groupPnl(trades, 'instrument').slice(0, 5)
  const weekday = weekdayPnl(trades)
  const grades = groupPnl(trades, 'setup_tag').slice(0, 5)
  const rr = riskRewardBins(trades)
  const payoutItems = payoutTrend(payouts)

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function resetFilters() {
    setFilters({
      account: 'All Accounts',
      symbol: 'All Symbols',
      session: 'All Sessions',
      start: '',
      end: '',
    })
  }

  function exportPdf() {
    setExportStatus('Print dialog opened. Choose Save as PDF to export this analytics view.')
    window.print()
  }

  return (
    <section className="analytics-page">
      {showBanner && (
        <div className="trial-banner">
          <ShieldCheck size={16} />
          <span>Analytics Overview uses your Supabase trades, accounts, payouts, and journal data.</span>
          <button type="button" onClick={() => setShowBanner(false)} aria-label="Dismiss analytics banner">×</button>
        </div>
      )}
      <div className="records-head">
        <div>
          <span>ANALYTICS OVERVIEW</span>
          <h2>Analytics Dashboard</h2>
          <p>Complete performance overview across all your trading activity.</p>
        </div>
        <div className="records-actions">
          <button className="btn ghost" type="button" onClick={resetFilters}>
            <RotateCcw size={16} /> Reset
          </button>
          <button className="btn primary" type="button" onClick={exportPdf}>
            <Download size={16} /> Export to PDF
          </button>
        </div>
      </div>
      <div className="analytics-filters">
        <label>
          <span>Account</span>
          <select value={filters.account} onChange={(event) => updateFilter('account', event.target.value)}>
            {accountOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Symbol</span>
          <select value={filters.symbol} onChange={(event) => updateFilter('symbol', event.target.value)}>
            {symbolOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Session</span>
          <select value={filters.session} onChange={(event) => updateFilter('session', event.target.value)}>
            {sessionOptions.map((option) => <option value={option} key={option || 'none'}>{option || 'None'}</option>)}
          </select>
        </label>
        <label>
          <span>Start Date</span>
          <input type="date" value={filters.start} onChange={(event) => updateFilter('start', event.target.value)} />
        </label>
        <label>
          <span>End Date</span>
          <input type="date" value={filters.end} onChange={(event) => updateFilter('end', event.target.value)} />
        </label>
      </div>
      {exportStatus && <p className="export-status">{exportStatus}</p>}
      <div className="analytics-kpis">
        <StatCard icon={BookOpen} label="Total Trades" value={trades.length} hint={`${totals.wins}W / ${totals.losses}L / ${totals.breakEven}BE`} tone="aqua" />
        <StatCard icon={Target} label="Win Rate" value={`${totals.winRate}%`} hint={totals.winRate >= 50 ? 'Above 50%' : 'Below 50%'} tone="violet" />
        <StatCard icon={LineChart} label="Total PnL" value={money(totals.totalPnl)} hint={totals.totalPnl >= 0 ? 'Profitable' : 'Drawdown'} tone="amber" trend={totals.totalPnl < 0 ? 'negative' : 'positive'} />
        <StatCard icon={Activity} label="Avg Risk:Reward" value={`1:${totals.avgR.toFixed(1)}`} hint={totals.avgR >= 2 ? 'Strong R:R' : 'Low R:R'} tone="mint" />
        <StatCard icon={CircleDollarSign} label="Total Payouts" value={money(totals.totalPayouts)} hint={`${payouts.length} payouts from ${accounts.length} accounts`} tone="violet" />
        <StatCard icon={WalletCards} label="Active Accounts" value={totals.activeAccounts} hint={`${(records.journal_entries || []).length} journal entries`} tone="aqua" />
      </div>
      <div className="analytics-board">
        <MiniChart title="Equity Curve" copy="Cumulative P&L over time" points={equity} wide />
        <RatioCard wins={totals.wins} losses={totals.losses} breakEven={totals.breakEven} />
        <BarPreview title="Performance by Session" copy="London vs New York vs Asian" items={sessionItems} />
        <BarPreview title="Top Symbols" copy="Performance by trading pair" items={symbols} />
        <BarPreview title="PnL by Day of Week" copy="Which days are most profitable" items={weekday} wide />
        <BarPreview title="Setup Grade Distribution" copy="Quality of your trade setups" items={grades} />
        <BarPreview title="Psychology Insights" copy="Mental state impact on performance" items={psychologyItems(trades)} />
        <BarPreview title="Risk:Reward Distribution" copy="How your R:R ratios are distributed" items={rr} />
        <BarPreview title="Payout Trend" copy="Monthly payout income" items={payoutItems} />
      </div>
    </section>
  )
}

function MiniChart({ title, copy, points, wide }) {
  const path = sparklinePath(points)
  return (
    <section className={`glass-panel chart-panel ${wide ? 'wide' : ''}`}>
      <div>
        <h3>{title}</h3>
        {copy && <p>{copy}</p>}
      </div>
      {points.length ? (
        <svg viewBox="0 0 420 170" role="img" aria-label={title}>
          <path d={path.area} fill="rgba(97, 115, 255, 0.13)" />
          <path d={path.line} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : (
        <p className="empty-chart">No trade data yet</p>
      )}
    </section>
  )
}

function BarPreview({ title, copy, items, wide }) {
  const max = Math.max(1, ...items.map((item) => Math.abs(item.value)))
  return (
    <section className={`glass-panel bar-panel ${wide ? 'wide' : ''}`}>
      <div>
        <h3>{title}</h3>
        {copy && <p>{copy}</p>}
      </div>
      {items.length ? (
        <div className="bar-list">
          {items.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <i>
                <b className={item.value < 0 ? 'loss' : ''} style={{ width: `${Math.max(6, (Math.abs(item.value) / max) * 100)}%` }} />
              </i>
              <strong className={item.value < 0 ? 'negative' : ''}>{item.format || money(item.value)}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-chart">No data yet</p>
      )}
    </section>
  )
}

function RatioCard({ wins, losses, breakEven }) {
  const total = Math.max(1, wins + losses + breakEven)
  return (
    <section className="glass-panel ratio-panel">
      <h3>Win/Loss Ratio</h3>
      <p>Trade outcome distribution</p>
      <div className="ratio-ring" style={{ '--wins': `${(wins / total) * 360}deg`, '--losses': `${((wins + losses) / total) * 360}deg` }}>
        <span>{wins + losses + breakEven}</span>
      </div>
      <div className="ratio-legend">
        <span>Wins ({wins})</span>
        <span>Losses ({losses})</span>
        <span>B/E ({breakEven})</span>
      </div>
    </section>
  )
}

function tradeTotals(trades, accounts, payouts) {
  const wins = trades.filter((trade) => trade.result === 'WIN').length
  const losses = trades.filter((trade) => trade.result === 'LOSS').length
  const breakEven = trades.filter((trade) => trade.result === 'BREAKEVEN').length
  const totalPnl = trades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0)
  const rTrades = trades.filter((trade) => trade.r_multiple !== null && trade.r_multiple !== undefined && trade.r_multiple !== '')
  const avgR = rTrades.length ? rTrades.reduce((sum, trade) => sum + Math.abs(Number(trade.r_multiple || 0)), 0) / rTrades.length : 0
  return {
    wins,
    losses,
    breakEven,
    totalPnl,
    avgR,
    winRate: trades.length ? Math.round((wins / trades.length) * 100) : 0,
    totalPayouts: payouts.reduce((sum, payout) => sum + Number(payout.amount || 0), 0),
    activeAccounts: accounts.filter((account) => !account.status || account.status === 'ACTIVE' || account.status === 'PASSED').length,
  }
}

function tradeTime(trade) {
  return Number(trade.opened_at || trade.created_at || trade.updated_at || Date.now())
}

function filterTradesByRange(trades, range) {
  if (range === 'All') return trades
  const now = new Date()
  const end = now.getTime()
  if (range === 'Today') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return trades.filter((trade) => tradeTime(trade) >= start.getTime() && tradeTime(trade) <= end)
  }
  const days = Number.parseInt(range, 10)
  if (!days) return trades
  const start = new Date(now)
  start.setDate(start.getDate() - days + 1)
  start.setHours(0, 0, 0, 0)
  return trades.filter((trade) => tradeTime(trade) >= start.getTime() && tradeTime(trade) <= end)
}

function tradeInPeriod(trade, period) {
  if (period === 'All Time' || period === 'Custom') return true
  const days = Number.parseInt(period.replace(/\D/g, ''), 10)
  if (!days) return true
  const start = new Date()
  start.setDate(start.getDate() - days + 1)
  start.setHours(0, 0, 0, 0)
  return tradeTime(trade) >= start.getTime()
}

function monthTitle(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

function monthHeatDays(trades, baseDate = new Date()) {
  const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate()
  const today = new Date()
  const cells = []
  for (let i = 0; i < first.getDay(); i += 1) cells.push({ key: `lead-${i}`, date: '', outside: true, pnl: 0, trades: 0 })
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayTrades = trades.filter((trade) => {
      const date = new Date(tradeTime(trade))
      return date.getFullYear() === baseDate.getFullYear() && date.getMonth() === baseDate.getMonth() && date.getDate() === day
    })
    cells.push({
      key: `${baseDate.getFullYear()}-${baseDate.getMonth()}-${day}`,
      date: day,
      trades: dayTrades.length,
      pnl: dayTrades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0),
      today: today.getFullYear() === baseDate.getFullYear() && today.getMonth() === baseDate.getMonth() && today.getDate() === day,
    })
  }
  while (cells.length % 7 !== 0) cells.push({ key: `tail-${cells.length}`, date: '', outside: true, pnl: 0, trades: 0 })
  return cells
}

function weeklyPnl(trades, baseDate = new Date()) {
  const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate()
  const weekCount = Math.ceil((first.getDay() + daysInMonth) / 7)
  const weeks = Array.from({ length: weekCount }, (_, index) => ({ label: `Week ${index + 1}`, pnl: 0, trades: 0 }))
  trades.forEach((trade) => {
    const date = new Date(tradeTime(trade))
    if (date.getFullYear() !== baseDate.getFullYear() || date.getMonth() !== baseDate.getMonth()) return
    const week = Math.floor((first.getDay() + date.getDate() - 1) / 7)
    weeks[week].pnl += Number(trade.pnl || 0)
    weeks[week].trades += 1
  })
  return weeks
}

function equityCurve(trades) {
  let running = 0
  return [...trades]
    .sort((a, b) => tradeTime(a) - tradeTime(b))
    .map((trade) => {
      running += Number(trade.pnl || 0)
      return running
    })
}

function sparklinePath(points) {
  if (!points.length) return { line: '', area: '' }
  if (points.length === 1) points = [0, points[0]]
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 390 + 15
    const y = 150 - ((point - min) / range) * 120
    return [x, y]
  })
  const line = coords.map(([x, y], index) => `${index ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L 405 165 L 15 165 Z`
  return { line, area }
}

function groupPnl(trades, field, preferred = []) {
  const map = new Map()
  preferred.forEach((label) => map.set(label, { label, value: 0, count: 0 }))
  trades.forEach((trade) => {
    const label = trade[field] || 'Unassigned'
    const current = map.get(label) || { label, value: 0, count: 0 }
    current.value += Number(trade.pnl || 0)
    current.count += 1
    map.set(label, current)
  })
  return [...map.values()]
    .filter((item) => item.count || preferred.includes(item.label))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
}

function weekdayPnl(trades) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const items = labels.map((label) => ({ label, value: 0, count: 0 }))
  trades.forEach((trade) => {
    const item = items[new Date(tradeTime(trade)).getDay()]
    item.value += Number(trade.pnl || 0)
    item.count += 1
  })
  return items
}

function riskRewardBins(trades) {
  const bins = [
    ['< 1:1', (value) => value < 1],
    ['1:1 - 2:1', (value) => value >= 1 && value < 2],
    ['2:1 - 3:1', (value) => value >= 2 && value < 3],
    ['3:1 - 5:1', (value) => value >= 3 && value < 5],
    ['5:1+', (value) => value >= 5],
  ]
  return bins.map(([label, test]) => {
    const count = trades.filter((trade) => test(Math.abs(Number(trade.r_multiple || 0)))).length
    return { label, value: count, format: String(count) }
  })
}

function psychologyItems(trades) {
  const words = ['Calm', 'Patient', 'Fear', 'FOMO', 'Rule break']
  return words.map((word) => {
    const count = trades.filter((trade) => String(trade.psychology || trade.notes || '').toLowerCase().includes(word.toLowerCase())).length
    return { label: word, value: count, format: String(count) }
  })
}

function payoutTrend(payouts) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((label, index) => {
    const value = payouts
      .filter((payout) => {
        const date = payout.date ? new Date(payout.date) : new Date()
        return date.getMonth() === index
      })
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0)
    return { label, value }
  })
}

function RecordsView({ configKey, records, openModal, deleteRecord }) {
  const config = tableConfigs[configKey]
  const Icon = config.icon

  return (
    <section className="records-view">
      <div className="records-head">
        <div>
          <span>{config.title}</span>
          <h2>{config.title === 'Journal' ? 'Mindset and daily review' : `${config.title} ledger`}</h2>
        </div>
        <button className="btn primary" onClick={() => openModal({ configKey })}>
          <Plus size={16} /> Add {config.title.replace(/s$/, '')}
        </button>
      </div>
      {!records.length ? (
        <div className="empty-state">
          <Icon size={28} />
          <h3>{config.empty}</h3>
          <button className="btn primary" onClick={() => openModal({ configKey })}>
            Create record
          </button>
        </div>
      ) : (
        <RecordList
          rows={records}
          configKey={configKey}
          editRecord={(record) => openModal({ configKey, record })}
          deleteRecord={deleteRecord}
        />
      )}
    </section>
  )
}

function RecordList({ rows, configKey, compact, editRecord, deleteRecord }) {
  if (!rows?.length) return <p className="muted-copy">No records yet.</p>
  return (
    <div className={compact ? 'compact-list' : 'record-list'}>
      {rows.map((row) => (
        <RecordCard
          key={row.uid}
          row={row}
          configKey={configKey}
          compact={compact}
          editRecord={editRecord}
          deleteRecord={deleteRecord}
        />
      ))}
    </div>
  )
}

function RecordCard({ row, configKey, compact, editRecord, deleteRecord }) {
  const title =
    row.instrument ||
    row.title ||
    row.name ||
    row.account_name ||
    row.date ||
    'Untitled record'
  const subtitle =
    configKey === 'trades'
      ? `${row.direction || ''} · ${row.result || ''} · ${row.session || 'No session'}`
      : configKey === 'backtests'
        ? `${row.instrument || 'No symbol'} · ${row.result || 'Open'}`
        : configKey === 'accounts'
          ? `${row.broker || 'Broker'} · ${row.status || 'Active'}`
          : configKey === 'payouts'
            ? `${row.status || 'Pending'} · ${row.currency || 'USD'}`
            : row.tags || 'TradeLog record'
  const image = safeImageUrl(row.screenshot_url || row.chart5_url || row.chart15_url)
  const amount = configKey === 'trades' ? row.pnl : configKey === 'payouts' ? row.amount : row.balance

  return (
    <article className="record-card">
      {image && <img src={image} alt="" />}
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {amount != null && amount !== '' && (
        <strong className={Number(amount) < 0 ? 'negative' : 'positive'}>{money(amount, row.currency || 'USD')}</strong>
      )}
      {!compact && (
        <div className="record-actions">
          <button onClick={() => editRecord(row)}>Edit</button>
          <button onClick={() => deleteRecord(configKey, row.uid)} aria-label="Delete record">
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </article>
  )
}

function RecordModal({ modal, close, uploadImage, saveRecord, accounts = [] }) {
  const { configKey, record } = modal
  const config = tableConfigs[configKey]
  const [values, setValues] = useState(() => buildInitialValues(config, record))
  const [files, setFiles] = useState({})
  const [checkedItems, setCheckedItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const usesChecklist = configKey === 'trades' || configKey === 'backtests'
  const detailFields =
    configKey === 'trades'
      ? config.fields.slice(0, 11)
      : configKey === 'backtests'
        ? config.fields.slice(0, 9)
        : config.fields
  const reviewFields =
    configKey === 'trades'
      ? config.fields.slice(11)
      : configKey === 'backtests'
        ? config.fields.slice(9)
        : []
  const modalClass = [
    'record-modal',
    configKey === 'trades' ? 'trade-modal' : '',
    configKey === 'backtests' ? 'backtest-modal checklist-modal' : '',
    configKey === 'journal_entries' ? 'journal-modal' : '',
  ].filter(Boolean).join(' ')
  const modalCopy =
    configKey === 'trades'
      ? 'Log execution, risk, psychology, screenshots, and review notes in one clean record.'
      : configKey === 'backtests'
        ? 'Save the model evidence, Somali checklist, 5M and 15M charts, and lesson notes.'
        : configKey === 'journal_entries'
          ? 'Capture mindset, routine, reflection, discipline, and the plan for the next session.'
          : 'Keep this record synced with your TradeLog cloud data.'

  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  function toggleChecklist(index) {
    setCheckedItems((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    )
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const nextValues = { ...values }
      for (const [name, file] of Object.entries(files)) {
        if (file) nextValues[name] = await uploadImage(file)
      }
      const payload = {}
      for (const [name, _label, type] of config.fields) {
        payload[name] = parseValue(type, nextValues[name])
      }
      if (configKey === 'trades') payload.opened_at = record?.opened_at || msNow()
      await saveRecord(configKey, payload, record?.uid)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dialog-backdrop">
      <form className={modalClass} onSubmit={submit}>
        <div className="modal-head">
          <div>
            <span>{record ? 'Edit record' : 'New record'}</span>
            <h2>{config.title}</h2>
            <p>{modalCopy}</p>
          </div>
          <button type="button" className="close" onClick={close} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="form-grid">
          {detailFields.map(([name, label, type, options]) => (
            <Field
              key={name}
              name={name}
              label={label}
              type={type}
              options={options}
              accounts={accounts}
              value={values[name]}
              update={update}
              setFile={(file) => setFiles((current) => ({ ...current, [name]: file }))}
            />
          ))}
        </div>
        {usesChecklist && (
          <TradeChecklist checkedItems={checkedItems} toggleChecklist={toggleChecklist} />
        )}
        {reviewFields.length > 0 && (
          <div className="form-grid review-grid">
            {reviewFields.map(([name, label, type, options]) => (
              <Field
                key={name}
                name={name}
                label={label}
                type={type}
                options={options}
                accounts={accounts}
                value={values[name]}
                update={update}
                setFile={(file) => setFiles((current) => ({ ...current, [name]: file }))}
              />
            ))}
          </div>
        )}
        {error && <div className="form-error">{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={close}>Cancel</button>
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save record'}
          </button>
        </div>
      </form>
    </div>
  )
}

function TradeChecklist({ checkedItems, toggleChecklist }) {
  return (
    <section className="trade-checklist">
      <div>
        <h3>Soomaali Checklist</h3>
        <strong>{checkedItems.length}/5</strong>
      </div>
      <label>
        <span>Select checklist</span>
        <select defaultValue="Default Checklist">
          <option>Default Checklist</option>
          <option>Soomaali Checklist</option>
        </select>
      </label>
      <div className="checklist-items">
        {tradeChecklist.map((item, index) => (
          <button
            type="button"
            className={checkedItems.includes(index) ? 'checked' : ''}
            onClick={() => toggleChecklist(index)}
            key={item}
          >
            <span>{checkedItems.includes(index) && <Check size={13} />}</span>
            {item}
          </button>
        ))}
      </div>
    </section>
  )
}

function buildInitialValues(config, record) {
  const initial = { ...config.defaults, ...record }
  for (const [name, _label, type] of config.fields) {
    if (type === 'date') initial[name] = toDateInput(initial[name])
    if (type === 'dateText' && !initial[name]) initial[name] = new Date().toISOString().slice(0, 10)
    if (initial[name] == null) initial[name] = type === 'checkbox' ? false : ''
  }
  return initial
}

function Field({ name, label, type, options, value, update, setFile, accounts = [] }) {
  if (type === 'account') {
    const live = accounts.filter((a) => !a.deleted)
    return (
      <label className="field">
        <span>{label}</span>
        <select value={value || ''} onChange={(e) => update(name, e.target.value)}>
          <option value="">No account</option>
          {live.map((a) => (
            <option key={a.uid} value={a.uid}>
              {a.name || a.broker || 'Account'}
            </option>
          ))}
        </select>
      </label>
    )
  }
  if (name === 'psychology') {
    return (
      <PsychologyField
        name={name}
        label={label}
        value={value}
        update={update}
      />
    )
  }
  if (type === 'textarea') {
    return (
      <label className="field span-2">
        <span>{label}</span>
        <textarea value={value || ''} onChange={(e) => update(name, e.target.value)} rows={4} />
      </label>
    )
  }
  if (type === 'select') {
    return (
      <label className="field">
        <span>{label}</span>
        <select value={value || ''} onChange={(e) => update(name, e.target.value)}>
          {(options || []).map((option) => (
            <option key={option} value={option}>
              {option || 'None'}
            </option>
          ))}
        </select>
      </label>
    )
  }
  if (type === 'checkbox') {
    return (
      <label className="field check-field">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => update(name, e.target.checked)} />
        <span>{label}</span>
      </label>
    )
  }
  if (type === 'image') {
    return (
      <label className="field span-2 image-field">
        <span>{label}</span>
        <input value={value || ''} onChange={(e) => update(name, e.target.value)} placeholder="Paste image URL or upload below" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
      </label>
    )
  }
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value || ''}
        type={type === 'date' || type === 'dateText' ? 'date' : type}
        onChange={(e) => update(name, e.target.value)}
        placeholder={options || ''}
      />
    </label>
  )
}

function parsePsychology(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function PsychologyField({ name, label, value, update }) {
  const selected = parsePsychology(value)

  function toggle(option) {
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option]
    update(name, next.join(', '))
  }

  return (
    <div className="field span-2 psychology-field">
      <span>{label}</span>
      <div className="psychology-grid">
        {psychologyOptions.map((option) => (
          <button
            type="button"
            className={selected.includes(option) ? 'selected' : ''}
            onClick={() => toggle(option)}
            key={option}
          >
            {option}
          </button>
        ))}
      </div>
      <input
        value={value || ''}
        onChange={(event) => update(name, event.target.value)}
        placeholder="Selected states appear here, or add your own note"
      />
    </div>
  )
}

function ToolsPanel() {
  const [currency, setCurrency] = useState('USD')
  const [pair, setPair] = useState('EURUSD')
  const [balance, setBalance] = useState(10000)
  const [risk, setRisk] = useState(1)
  const [stop, setStop] = useState(10)
  const [pipValue, setPipValue] = useState(10)
  const riskAmount = Math.max(0, Number(balance || 0)) * (Math.max(0, Number(risk || 0)) / 100)
  const lotSize = stop > 0 && pipValue > 0 ? riskAmount / (Number(stop) * Number(pipValue)) : 0
  const units = lotSize * 100000
  const exposurePerPip = lotSize * Number(pipValue || 0)

  function resetCalculator() {
    setCurrency('USD')
    setPair('EURUSD')
    setBalance(10000)
    setRisk(1)
    setStop(10)
    setPipValue(10)
  }

  return (
    <section className="tools-panel">
      <div className="records-head">
        <div>
          <span>Tools</span>
          <h2>Position calculator</h2>
          <p>Calculate risk before the trade: balance, stop loss, pip value, lots, and units.</p>
        </div>
        <div className="records-actions">
          <button className="btn ghost" type="button" onClick={() => setRisk(1)}>Use 1%</button>
          <button className="btn ghost" type="button" onClick={() => setRisk(2)}>Use 2%</button>
          <button className="btn ghost" type="button" onClick={resetCalculator}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
      <div className="calculator-panel">
        <label className="calc-field">
          <span>Pair</span>
          <select value={pair} onChange={(event) => setPair(event.target.value)}>
            {['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'US30'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="calc-field">
          <span>Account currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {['USD', 'GBP', 'EUR'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="calc-field">
          <span>Balance</span>
          <input type="number" min="0" value={balance} onChange={(event) => setBalance(Number(event.target.value))} />
        </label>
        <label className="calc-field">
          <span>Risk %</span>
          <input type="number" min="0" step="0.1" value={risk} onChange={(event) => setRisk(Number(event.target.value))} />
        </label>
        <label className="calc-field">
          <span>Stop loss pips</span>
          <input type="number" min="0" step="0.1" value={stop} onChange={(event) => setStop(Number(event.target.value))} />
        </label>
        <label className="calc-field">
          <span>Pip value per lot</span>
          <input type="number" min="0" step="0.01" value={pipValue} onChange={(event) => setPipValue(Number(event.target.value))} />
        </label>
        <div className="calc-output">
          <span>Risk amount</span>
          <strong>{money(riskAmount, currency)}</strong>
        </div>
        <div className="calc-output">
          <span>Lot size</span>
          <strong>{lotSize.toFixed(2)}</strong>
        </div>
        <div className="calc-output">
          <span>Units</span>
          <strong>{Math.round(units).toLocaleString('en-US')}</strong>
        </div>
        <div className="calc-output">
          <span>{pair} per pip</span>
          <strong>{money(exposurePerPip, currency)}</strong>
        </div>
      </div>
    </section>
  )
}

function EconomicCalendarPanel() {
  const [impact, setImpact] = useState('High')
  const [currencies, setCurrencies] = useState(calendarCurrencyPresets[0])
  const [embedVisible, setEmbedVisible] = useState(false)
  const impactMap = {
    All: '1,2,3',
    High: '3',
    Medium: '2,3',
    Low: '1,2,3',
  }
  const widgetSrc = `https://widgets.myfxbook.com/widgets/economic-calendar.html?lang=en&impacts=${impactMap[impact]}&symbols=${encodeURIComponent(currencies)}`

  return (
    <section className="economic-calendar-page">
      <div className="records-head">
        <div>
          <span>MYFXBOOK</span>
          <h2>Economic calendar</h2>
          <p>Use high-impact news beside your journal before logging trades or backtests.</p>
        </div>
        <a className="btn primary" href={myfxbookCalendarUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> Open Myfxbook
        </a>
      </div>
      <div className="calendar-toolbar">
        <div>
          <span>Impact</span>
          {['High', 'Medium', 'All'].map((item) => (
            <button
              type="button"
              className={impact === item ? 'active' : ''}
              onClick={() => setImpact(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setEmbedVisible((current) => !current)}>
          {embedVisible ? 'Hide embed' : 'Try embedded widget'}
        </button>
        <label>
          <span>Currencies</span>
          <select value={currencies} onChange={(event) => setCurrencies(event.target.value)}>
            {calendarCurrencyPresets.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="myfxbook-frame">
        {embedVisible ? (
          <>
            <div className="frame-notice">
              <CalendarDays size={18} />
              <span>If Myfxbook blocks this frame, use the official calendar link.</span>
              <a href={myfxbookCalendarUrl} target="_blank" rel="noreferrer">Open Myfxbook</a>
            </div>
            <iframe title="Myfxbook economic calendar" src={widgetSrc} loading="lazy" />
          </>
        ) : (
          <div className="calendar-fallback-card">
            <CalendarDays size={34} />
            <div>
              <span>Official Myfxbook source</span>
              <h3>Open the live economic calendar</h3>
              <p>Myfxbook provides the economic calendar widget and real-time market event tools. Some local browsers block the embedded widget, so the official calendar opens in a new tab.</p>
            </div>
            <a className="btn primary" href={myfxbookCalendarUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} /> Open Live Calendar
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function CouponsPanel() {
  const [copied, setCopied] = useState('')
  const coupons = [
    ['Prop Firm', 'BLACKX10', 'Use for prop-firm checkout notes and challenge discounts.'],
    ['Broker Tools', 'TRADELOG', 'Keep platform, VPS, and journal discount codes visible.'],
    ['Education', 'EDGE20', 'Track course or community coupon codes before renewal.'],
  ]

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
    } catch {
      setCopied('manual')
    }
  }

  return (
    <section className="coupons-page">
      <div className="records-head">
        <div>
          <span>TOOLS</span>
          <h2>Coupons</h2>
          <p>Store broker, prop-firm, VPS, and trading-tool codes beside the journal.</p>
        </div>
      </div>
      <div className="coupon-grid">
        {coupons.map(([title, code, copy]) => (
          <article className="coupon-card" key={code}>
            <span>{title}</span>
            <h3>{code}</h3>
            <p>{copy}</p>
            <button type="button" onClick={() => copyCode(code)}>
              {copied === code ? <Check size={16} /> : <Tag size={16} />}
              {copied === code ? 'Copied' : 'Copy code'}
            </button>
          </article>
        ))}
      </div>
      {copied === 'manual' && <p className="export-status">Clipboard permission was blocked. Select the code and copy it manually.</p>}
    </section>
  )
}

function StatisticsCenter({ records, setView }) {
  const trades = records.trades || []
  const backtests = records.backtests || []
  const tradeSummary = tradeTotals(trades, records.accounts || [], records.payouts || [])
  const backtestWins = backtests.filter((item) => item.result === 'WIN').length
  const backtestLosses = backtests.filter((item) => item.result === 'LOSS').length
  const backtestRate = backtests.length ? Math.round((backtestWins / backtests.length) * 100) : 0

  return (
    <section className="statistics-page">
      <div className="records-head">
        <div>
          <span>BACKTESTING AREA</span>
          <h2>Statistics Center</h2>
          <p>Compare live execution with backtested model evidence.</p>
        </div>
        <div className="records-actions">
          <button className="btn ghost" type="button" onClick={() => setView('analytics')}>Open Analytics</button>
          <button className="btn primary" type="button" onClick={() => setView('backtests')}>Backtested Trades</button>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard icon={LineChart} label="Live Trades" value={trades.length} hint={`${tradeSummary.wins}W / ${tradeSummary.losses}L`} tone="aqua" />
        <StatCard icon={Target} label="Live Win Rate" value={`${tradeSummary.winRate}%`} hint="Trading journal" tone="violet" />
        <StatCard icon={TrendingUp} label="Backtests" value={backtests.length} hint={`${backtestWins}W / ${backtestLosses}L`} tone="amber" />
        <StatCard icon={BarChart3} label="Model Win Rate" value={`${backtestRate}%`} hint="Backtesting area" tone="mint" />
      </div>
      <div className="analytics-board">
        <BarPreview title="Backtest Results" copy="Model outcome distribution" items={[
          { label: 'Wins', value: backtestWins, format: String(backtestWins) },
          { label: 'Losses', value: backtestLosses, format: String(backtestLosses) },
          { label: 'Break-even', value: backtests.filter((item) => item.result === 'BREAKEVEN').length, format: String(backtests.filter((item) => item.result === 'BREAKEVEN').length) },
        ]} />
        <BarPreview title="Live Sessions" copy="Current journal performance" items={groupPnl(trades, 'session', ['ASIA', 'LONDON', 'NEW YORK'])} />
        <BarPreview title="Backtest Symbols" copy="Most tested instruments" items={groupPnl(backtests.map((item) => ({ ...item, pnl: item.result === 'WIN' ? 1 : item.result === 'LOSS' ? -1 : 0 })), 'instrument').slice(0, 5)} />
      </div>
    </section>
  )
}
