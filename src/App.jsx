import React, { useState, useEffect, useRef } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <div className="video-player-widget">
      <video
        ref={videoRef}
        src="/Video_Project_3.mp4"
        onTimeUpdate={handleTimeUpdate}
        muted={isMuted}
        style={{
          width: '100%',
          borderRadius: '8px',
          backgroundColor: '#111',
          objectFit: 'cover',
          aspectRatio: '16/9',
          filter: 'contrast(1.05) saturate(1.1) brightness(1.02)'
        }}
        playsInline
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--color--foreground--100)'
      }}>
        <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            style={{
              width: '100%',
              height: '4px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, var(--color--foreground--100) ${progress}%, var(--color--foreground--25) ${progress}%)`,
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.11-.31 2.16-.8 3.1-1.46L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
          )}
        </button>
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color--foreground--100);
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color--foreground--100);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

const StatCounter = ({ target, label, delay, suffix = '', finalText = null, duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Reset visually before starting
        setCount(0);
        setDone(false);
        setVisible(false);

        setTimeout(() => {
          setVisible(true);
          if (typeof target === 'number') {
            const startTime = performance.now();

            const update = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(easedProgress * target));

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                setDone(true);
              }
            };
            requestAnimationFrame(update);
          }
        }, delay);
      } else {
        setVisible(false);
      }
    }, { threshold: 0.1 });

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [target, delay, duration]);

  const displayValue = finalText && done ? finalText : (typeof target === 'number' ? count.toLocaleString() + suffix : target);
  const finalDisplay = displayValue === '∞' ? <span className="stat-infinity">∞</span> : displayValue;

  return (
    <div ref={countRef} className={`stat-item ${visible ? 'is--visible' : ''}`}>
      <span className="stat-number">{finalDisplay}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(0);
  const [gridVisible, setGridVisible] = useState(true);
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const [isCoverVisible, setIsCoverVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial timeouts
    const coverTimer = setTimeout(() => setIsCoverVisible(false), 1750);
    const loadTimer = setTimeout(() => setIsLoading(false), 3250);
    return () => { clearTimeout(coverTimer); clearTimeout(loadTimer); };
  }, []);

  useEffect(() => {
    // Sync body classes
    document.body.className = '';
    if (isCoverVisible) document.body.classList.add('cover--is--visible');
    if (isLoading) document.body.classList.add('is--loading');
    document.body.classList.add(`theme--${theme < 10 ? '0' + theme : theme}`);
    if (mobileNavVisible) document.body.classList.add('mobile-nav--is--visible');
  }, [theme, isCoverVisible, isLoading, mobileNavVisible]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.which) {
        case 71: // g
        case 186: // ;
          setGridVisible(prev => !prev);
          break;
        case 87: // w
        case 66: // b
          setTheme(prev => prev === 0 ? 16 : 0);
          break;
        case 83: // s
          setTheme(prev => prev > 0 ? prev - 1 : 16);
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const viewportHalf = window.innerHeight / 2;
      const scrollMiddle = scrollPos + viewportHalf;
      // Define a simple scroll spy for sections
      const sections = ['intro', 'values', 'background', 'about', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollMiddle >= top && scrollMiddle <= bottom) {
            setActiveSection(id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: id === 'contact' && el.offsetHeight <= window.innerHeight ? document.body.scrollHeight - window.innerHeight : el.offsetTop,
        behavior: 'smooth'
      });
    }
    setMobileNavVisible(false);
  };

  const handleThemeChange = (e) => {
    setTheme(parseInt(e.target.value));
  };

  return (
    <>
      <header className="app-header">
        <div className="content">
          <div className="brand">
            <h3><span>Y</span><span>u</span><span>g</span><span> </span><span>S</span><span>r</span><span>i</span><span>v</span><span>a</span><span>s</span><span>t</span><span>a</span><span>v</span></h3>
          </div>
          <div className="actions">
            <div className="option navigation" onClick={() => setMobileNavVisible(!mobileNavVisible)}>
              <div className="content">
                <div className="icon">
                  <div className="line"><div className="content"></div></div>
                  <div className="line"><div className="content"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="content">
          <div className={`item intro ${activeSection === 'intro' ? 'is--active' : ''}`} onClick={() => scrollTo('intro')}>Intro</div>
          <div className={`item values ${activeSection === 'values' ? 'is--active' : ''}`} onClick={() => scrollTo('values')}>Values</div>
          <div className={`item background ${activeSection === 'background' ? 'is--active' : ''}`} onClick={() => scrollTo('background')}>Background</div>
          <div className={`item about ${activeSection === 'about' ? 'is--active' : ''}`} onClick={() => scrollTo('about')}>About</div>
          <div className={`item contact ${activeSection === 'contact' ? 'is--active' : ''}`} onClick={() => scrollTo('contact')}>Contact</div>
        </div>
      </nav>

      <main className="app-main">
        <section className="section cover">
          <div className="content">
            <h1>Yug Srivastav<br />—Student Founder</h1>
          </div>
        </section>

        <section id="intro" className="section intro">
          <div className="content">
            <div className="texts custom-intro-texts">
              <h1 className="text anyone is--visible">Obsessed with problems <br />too real to ignore <br />and solutions too obvious <br />not to build.</h1>
            </div>
            <VideoPlayer />
          </div>
        </section>

        <section id="values" className="section values">
          <div className="content">
            <div className="title">
              <h1>Impact</h1>
              <h1>Depth</h1>
              <h1>Clarity</h1>
              <h1>Obsession</h1>
            </div>
            <div className="description">
              <p>These are my core values, and everything I build reflects them. I've always been someone who finds problems before others notice them and can't rest until something's been done about it. Turning a real messy problem into a clean working solution is what drives me. I like thinking big but moving fast, scrappy enough to ship and sharp enough to get it right. I zoom out on markets and strategy, zoom in on what users actually need. I'm always learning, always iterating, always pushing toward something that genuinely matters. Not just something that looks good on paper.</p>
            </div>
          </div>
        </section>

        <section id="background" className="section background">
          <div className="content">
            <div className="description">
              <p>I study Computer Science Engineering, got my start building side projects, validating startup ideas, and figuring out how real markets work. Leveraging my technical foundation and obsession with real problems, I've been building myself into someone who can go from idea to product without waiting for a team or a budget. I've worked on AI tools, field research, hardware builds, and web products, developing a scrappy range of skills across things most people keep separate. Still early in the journey but already in the game. My hunger to understand systems, move fast, and build things that actually work is what keeps me going.</p>
            </div>

            <div className="item">
              <div className="logo"><div className="content">
                <svg className="icon ideacheck" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M25.5 44c-.8 0-1.6-.3-2.1-.9l-9.5-9.5c-1.2-1.2-1.2-3.1 0-4.2 1.2-1.2 3.1-1.2 4.2 0l7.4 7.4 19.4-19.4c1.2-1.2 3.1-1.2 4.2 0 1.2 1.2 1.2 3.1 0 4.2L27.6 43.1c-.6.6-1.4.9-2.1.9z" fill="currentColor" /></svg>
              </div></div>
              <h1 className="company">IdeaCheck.in</h1>
              <h2 className="role">Creator</h2>
              <p className="description">
                IdeaCheck validates startup ideas for Indian markets regional trends, local conditions, ground level insights.
                <br />
                ₹10 per validation, built to be accessible, not profitable
              </p>
              <div className="stat-row">
                <StatCounter target={50} label="APIs integrated" delay={0} suffix="+" />
                <StatCounter target={2100} label="Ideas validated" delay={150} suffix="+" />
                <StatCounter target={1500} label="Data points per report" delay={300} suffix="+" duration={1300} />
              </div>
            </div>

            <div className="item">
              <div className="logo"><div className="content">
                <svg className="icon gavlock" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" /></svg>
              </div></div>
              <h1 className="company">Gavlock</h1>
              <h2 className="role">Founder</h2>
              <p className="description">
                Gavlock turns every AI decision into a tamper proof audit trail cryptographic receipts for every model output. Compliance-ready for wherever regulation lands.
                <br />
                Drop the agent Stay defensible.
              </p>
              <div className="stat-row gavlock-stats">
                <StatCounter target="∞" label="Audit trail retention" delay={0} />
                <StatCounter target={100} label="Decision coverage" delay={150} suffix="%" />
                <StatCounter target="1-click" label="Compliance export" delay={300} />
              </div>
            </div>

            <div className="item">
              <div className="logo"><div className="content">
                <svg className="icon bharatgeo" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 9v6l8 6 8-6V9l-8-6zm0 2.5l6 4.5v5l-6 4.5-6-4.5v-5l6-4.5z" /></svg>
              </div></div>
              <h1 className="company">BharatGeo</h1>
              <h2 className="role">Founder</h2>
              <p className="description">
                BharatGeo is a satellite intelligence API that converts Sentinel and ISRO imagery into crop health scores, yield and rain fall estimates, and insurance claims assessments for Indian agro tech startups and Insurers.
              </p>
              <div className="stat-row bharatgeo-stats">
                <StatCounter target={999} label="Data points processed" delay={0} finalText="Trillion+" duration={1400} />
                <StatCounter target={5} label="Indian states covered" delay={150} duration={800} />
                <StatCounter target={95} label="Imagery accuracy" delay={300} suffix="%" duration={1200} />
              </div>
            </div>
          </div>
        </section>

        <section id="techstack" className="section techstack">
          <div className="content">
            <h1 style={{ gridColumn: '1 / -1', paddingBottom: '20px' }}>My TechStack</h1>
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '32px',
              fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
              fontSize: '15px',
              lineHeight: '1.6',
              overflowX: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div className="terminal-dot red"></div>
                  <div className="terminal-dot yellow"></div>
                  <div className="terminal-dot green"></div>
                </div>
                <div style={{ color: '#9ca3af' }}>
                  <span style={{ color: '#60a5fa' }}>~/yug techstack</span>$ cat stack.txt
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '500px' }}>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>languages:</span><span style={{ color: '#f3f4f6' }}>Python, JavaScript, HTML</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>frontend:</span><span style={{ color: '#f3f4f6' }}>React, Vite, Three.js, GSAP, Tailwind</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>backend:</span><span style={{ color: '#f3f4f6' }}>Node.js, Express</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>apis:</span><span style={{ color: '#f3f4f6' }}>REST APIs, LLM APIs, Web Scraping</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>tools:</span><span style={{ color: '#f3f4f6' }}>Postman, Docker, Firebase, Supabase</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>ai/ml:</span><span style={{ color: '#f3f4f6' }}>Prompt Engineering, RAG, Computer Vision</span></div>
                <div style={{ display: 'flex' }}><span style={{ width: '140px', color: '#9ca3af' }}>hardware:</span><span style={{ color: '#f3f4f6' }}>ESP32, Arduino, Sensors</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="content">
            <div className="biography">
              <p>Still in my first year of college, but already collecting experiences that most people wait years for. I got selected for a national entrepreneurship bootcamp out of 1000+ applicants, did a product development apprenticeship at a premier tech institute, and won the Inspire Award 2022 from the Department of Science and Technology, Government of India for an agriculture based monitoring system. Alongside that I've been building startups, doing field research with real businesses, shipping products end to end, and incubating ideas through the GBU Incubation Centre. Just getting started.</p>
            </div>

            <div className="awards">
              <h2>Accolades</h2>
              <p>
                <span className="title">• Inspire Award Winner 2022 — Govt. of India</span>
              </p>
              <p>
                <span className="title">• Kaggle contributor — data analysis &amp; model submission</span>
              </p>
              <p>
                <span className="title">• Incubated project under Gautam Buddha University Incubation Centre</span>
              </p>
            </div>

            <div className="colophon">
              <h2>Colophon</h2>
              <p>
                <span className="description">Maintained by Yug Srivastav<br /></span>
                <span className="description">Typeface: Roobert Medium — Display Type Foundry<br /></span>
                <span className="description">Last updated: 24 April 2026<br /><br /></span>
                <span className="copyright">© 2026 Yug Srivastav</span>
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="content">
            <div className="text" style={{ paddingLeft: '0', paddingRight: '0', width: '100%' }}>
              <div className="content">
                <div className="look">
                  <div className="radius"></div>
                  <div className="dot"></div>
                </div>
              </div>

              <div className="actions">
                <div className="item"><a href="mailto:yug.srivastav99@gmail.com?subject=Enquiry%20from%20website">yug.srivastav99@gmail.com</a></div>
                <div className="item"><a href="https://www.linkedin.com/in/yug-srivastav-2646382aa/?skipRedirect=true" target="_blank" rel="noreferrer">LinkedIn</a></div>
                <div className="item"><a href="https://github.com/YugSrivastav/YugSrivastav" target="_blank" rel="noreferrer">Github</a></div>
                <div className="item"><a href="/Yug_Srivastav_Resumee.pdf" target="_blank" rel="noreferrer">My Resume</a></div>
              </div>
            </div>

            {/* Profile image removed per user request */}
          </div>
        </section>
      </main>

      <aside className="app-aside">
        <div className="options">
          <div className="option theme" onMouseEnter={() => document.body.classList.add('theme-slider--is--visible')} onMouseLeave={() => document.body.classList.remove('theme-slider--is--visible')}>
            <div className="icon-container">
              <svg className="icon theme" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <path d="M17 2h-2v6h2V2zm-1 8c-3.31372 0-6 2.68628-6 6s2.68628 6 6 6 6-2.68628 6-6-2.68628-6-6-6zm0 10c-2.20911 0-4-1.79089-4-4s1.79089-4 4-4 4 1.79089 4 4-1.79089 4-4 4zm-1 10h2v-6h-2v6zM11.05029 9.63605 6.80762 5.39337 5.39337 6.80762l4.24268 4.24268 1.41424-1.41425zm9.89954 12.72796 4.24255 4.24261 1.41425-1.41425-4.24261-4.24268-1.41419 1.41432zM8 15H2v2h6v-2zm16 0v2h6v-2h-6zM5.39337 25.19238l1.41425 1.41425 4.24268-4.24261-1.41425-1.41431-4.24268 4.24267zM26.60663 6.80762l-1.41425-1.41425-4.24268 4.24268 1.41431 1.41412 4.24262-4.24255z" />
              </svg>
            </div>
            <div className="slider-container">
              <div className="dots">
                {Array.from({ length: 17 }).map((_, i) => <div key={i} className="dot"></div>)}
              </div>
              <input className="slider" type="range" min="0" max="16" step="1" value={theme} onChange={handleThemeChange} />
            </div>
          </div>
          <div className="option grid" onClick={() => setGridVisible(!gridVisible)}>
            <div className="content">
              <svg className="icon grid" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <path d="M5 28h2V4H5v24zm5 0h2V4h-2v24zm5 0h2V4h-2v24zm5 0h2V4h-2v24zm5-24v24h2V4h-2z" />
              </svg>
            </div>
          </div>
        </div>
      </aside>

      <div className={`app-grid-overlay ${gridVisible ? 'is--visible' : ''}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="column">
            <div className="line"></div>
            <div className="line"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
