<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<meta name="theme-color" content="#1a1208"/>
<title>SPILRIX DISTRIBUTION — Your Music. Everywhere. Instantly.</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet"/>
<style>
/* ═══════════════════════════════════════════════════════════
   SPILRIX DISTRIBUTION — FUTURISTIC SKEUOMORPHISM DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════ */

:root, [data-theme="dark"] {
  --bg: #1a1208;
  --bg2: #221a0c;
  --surface: #2a1e10;
  --surface2: #342818;
  --surface-light: #3e3020;

  --orange: #ff6a00;
  --orange2: #ff8533;
  --orange3: #ffaa66;
  --orange-dim: rgba(255,106,0,0.08);
  --orange-glow: rgba(255,106,0,0.25);
  --cyan: #00e5ff;
  --cyan-dim: rgba(0,229,255,0.08);
  --purple: #b388ff;
  --purple-dim: rgba(179,136,255,0.08);

  --text: #f0ece6;
  --text-dim: #c8c2ba;
  --muted: #6a6460;
  --muted2: #9a928c;

  --green: #4ade80;
  --red: #f87171;

  --shadow-raised:
    8px 8px 16px rgba(10,5,0,0.55),
    -4px -4px 12px rgba(255,235,190,0.04),
    inset 0 1px 0 rgba(255,235,190,0.06);

  --shadow-pressed:
    inset 4px 4px 8px rgba(10,5,0,0.4),
    inset -2px -2px 6px rgba(255,235,190,0.03);

  --shadow-float:
    0 12px 40px rgba(10,5,0,0.55),
    0 4px 12px rgba(10,5,0,0.35),
    0 0 20px var(--orange-glow);

  --shadow-card:
    6px 6px 14px rgba(10,5,0,0.45),
    -3px -3px 10px rgba(255,235,190,0.03),
    inset 0 1px 0 rgba(255,235,190,0.05);

  --shadow-hover:
    10px 10px 24px rgba(10,5,0,0.55),
    -4px -4px 14px rgba(255,235,190,0.04),
    0 0 30px var(--orange-glow);

  --shadow-neon:
    0 0 15px var(--orange-glow),
    0 0 30px rgba(255,106,0,0.15),
    0 0 60px rgba(255,106,0,0.08);

  --glass-bg: rgba(42,30,16,0.7);
  --glass-border: rgba(255,235,190,0.1);
  --glass-highlight: linear-gradient(135deg, rgba(255,235,190,0.08) 0%, transparent 50%);

  --light-reflection: linear-gradient(135deg, rgba(255,235,190,0.06) 0%, transparent 40%, transparent 60%, rgba(255,235,190,0.03) 100%);

  --border: rgba(255,235,190,0.08);
  --border2: rgba(255,106,0,0.2);
  --border-glow: rgba(255,106,0,0.35);

  --grid-color: rgba(255,106,0,0.02);

  --orb1: rgba(255,80,10,0.12);
  --orb2: rgba(179,136,255,0.06);
  --orb3: rgba(0,229,255,0.04);

  --nav-bg: rgba(26,18,8,0.88);
  --nav-backdrop: rgba(16,10,4,0.85);

  --toggle-bg: #2a1e10;
  --toggle-knob: #ff6a00;
  --toggle-shadow: 0 0 12px rgba(255,106,0,0.4);
}

[data-theme="light"] {
  --bg: #e8ecf1;
  --bg2: #dde1e7;
  --surface: #f0f2f5;
  --surface2: #e8ecf1;
  --surface-light: #f5f7fa;

  --orange: #ff6a00;
  --orange2: #ff8533;
  --orange3: #ffaa66;
  --orange-dim: rgba(255,106,0,0.06);
  --orange-glow: rgba(255,106,0,0.15);
  --cyan: #00b8d4;
  --cyan-dim: rgba(0,184,212,0.06);
  --purple: #9c64ff;
  --purple-dim: rgba(156,100,255,0.06);

  --text: #1a1a2e;
  --text-dim: #4a4a5a;
  --muted: #8a8a9a;
  --muted2: #6a6a7a;

  --green: #22c55e;
  --red: #ef4444;

  --shadow-raised:
    8px 8px 16px #c8ccd1,
    -8px -8px 16px #ffffff,
    inset 0 1px 0 rgba(255,255,255,0.8);

  --shadow-pressed:
    inset 4px 4px 8px #c8ccd1,
    inset -4px -4px 8px #ffffff;

  --shadow-float:
    0 12px 40px rgba(0,0,0,0.12),
    0 4px 12px rgba(0,0,0,0.08),
    0 0 20px var(--orange-glow);

  --shadow-card:
    6px 6px 14px #c8ccd1,
    -6px -6px 14px #ffffff,
    inset 0 1px 0 rgba(255,255,255,0.7);

  --shadow-hover:
    10px 10px 24px #b8bcc1,
    -10px -10px 24px #ffffff,
    0 0 20px var(--orange-glow);

  --shadow-neon:
    0 0 10px var(--orange-glow),
    0 0 20px rgba(255,106,0,0.08);

  --glass-bg: rgba(240,242,245,0.75);
  --glass-border: rgba(255,255,255,0.5);
  --glass-highlight: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%);

  --light-reflection: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.3) 100%);

  --border: rgba(0,0,0,0.06);
  --border2: rgba(255,106,0,0.25);
  --border-glow: rgba(255,106,0,0.3);

  --grid-color: rgba(0,0,0,0.015);

  --orb1: rgba(255,120,50,0.06);
  --orb2: rgba(156,100,255,0.04);
  --orb3: rgba(0,184,212,0.03);

  --nav-bg: rgba(232,236,241,0.85);
  --nav-backdrop: rgba(220,224,230,0.7);

  --toggle-bg: #dde1e7;
  --toggle-knob: #ff6a00;
  --toggle-shadow: 4px 4px 8px #c8ccd1, -4px -4px 8px #ffffff;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--text);
  font-family:'DM Sans',sans-serif;
  font-size:16px;
  line-height:1.7;
  overflow-x:hidden;
  transition:background 0.4s ease, color 0.4s ease;
}

body, nav, .ham-btn, .logo-icon, .nav-cta, .nav-card, .nav-card-link,
.step, .feat, .price-card, .cta-banner, footer,
.stat-block, .contact-strip, .ticker-wrap, .section-tag, .btn-primary,
.btn-ghost, .tg-btn, .hero-content, .action-box, .action-input,
.section-title, .section-sub, .section-tag,
.hero-eyebrow, .hero-sub, .hero-title, .foot-links a, footer p {
  transition:background 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

body::after{
  content:'';
  position:fixed;
  inset:0;
  background-image:
    linear-gradient(var(--grid-color) 1px,transparent 1px),
    linear-gradient(90deg,var(--grid-color) 1px,transparent 1px);
  background-size:60px 60px;
  pointer-events:none;
  z-index:0;
  transition:background 0.4s ease;
}

.orb{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0;will-change:transform;transition:background 0.4s ease}
.orb-1{display:none}
.orb-2{width:550px;height:550px;background:var(--orb2);bottom:10%;left:-180px}
.orb-3{width:400px;height:300px;background:var(--orb3);top:50%;right:10%}

/* ── NAVIGATION ── */
nav{
  position:fixed;
  top:0;left:0;right:0;
  z-index:200;
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  padding:0 28px;
  height:70px;
  background:var(--nav-bg);
  backdrop-filter:blur(30px) saturate(180%);
  -webkit-backdrop-filter:blur(30px) saturate(180%);
  border-bottom:1px solid var(--glass-border);
  box-shadow:0 4px 20px rgba(0,0,0,0.4);
  will-change:transform;
  transition:background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
}
.nav-right{display:flex;align-items:center;justify-content:flex-end;gap:14px}

.ham-btn{
  display:flex;flex-direction:column;justify-content:center;gap:5px;
  width:44px;height:44px;padding:10px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:12px;cursor:pointer;z-index:10;
  box-shadow:var(--shadow-card);
  transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.ham-btn:hover{box-shadow:var(--shadow-hover);transform:translateY(-2px);border-color:var(--border2)}
.ham-btn:active{box-shadow:var(--shadow-pressed);transform:translateY(0)}
.ham-line{display:block;width:22px;height:2px;background:var(--muted2);border-radius:2px;transition:all 0.4s cubic-bezier(.4,0,.2,1);transform-origin:center}
.ham-btn.active .ham-line:nth-child(1){transform:translateY(7px) rotate(45deg);background:var(--orange)}
.ham-btn.active .ham-line:nth-child(2){opacity:0;transform:scaleX(0)}
.ham-btn.active .ham-line:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:var(--orange)}

.logo{
  font-family:'Bebas Neue',sans-serif;
  font-size:26px;letter-spacing:2px;
  color:var(--text);text-decoration:none;
  display:flex;align-items:center;gap:10px;justify-content:center;
}
.logo-icon{
  width:34px;height:34px;
  background:linear-gradient(135deg,var(--orange),var(--orange2));
  border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 20px var(--orange-glow), var(--shadow-card);
  animation:lpulse 3s ease-in-out infinite;
  position:relative;overflow:hidden;
}
.logo-icon::after{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.logo-icon svg{width:18px;height:18px;color:#fff;position:relative;z-index:1}
@keyframes lpulse{
  0%,100%{box-shadow:0 0 20px var(--orange-glow), var(--shadow-card)}
  50%{box-shadow:0 0 35px rgba(255,106,0,0.45), var(--shadow-card)}
}
.logo span{color:var(--orange)}

.nav-cta{
  background:linear-gradient(135deg,var(--orange),var(--orange2));
  color:#fff;padding:10px 24px;border-radius:10px;
  font-size:14px;font-weight:500;text-decoration:none;
  box-shadow:var(--shadow-card), 0 0 15px var(--orange-glow);
  white-space:nowrap;position:relative;overflow:hidden;
  transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.nav-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);transform:translateX(-100%);transition:transform 0.6s}
.nav-cta::after{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.nav-cta:hover::before{transform:translateX(100%)}
.nav-cta:hover{box-shadow:var(--shadow-hover), 0 0 25px rgba(255,106,0,0.4);transform:translateY(-2px)}
.nav-cta:active{box-shadow:var(--shadow-pressed);transform:translateY(0)}

/* ── THEME TOGGLE ── */
.theme-toggle-wrap{display:flex;align-items:center;justify-content:flex-end;position:relative;z-index:10}
.theme-toggle{
  position:relative;width:56px;height:30px;
  background:var(--toggle-bg);border-radius:100px;cursor:pointer;
  box-shadow:var(--toggle-shadow);
  transition:all 0.4s cubic-bezier(0.4,0,0.2,1);
  border:1px solid var(--border);
}
.theme-toggle .toggle-knob{
  position:absolute;top:3px;left:3px;width:22px;height:22px;
  background:var(--toggle-knob);border-radius:50%;
  transition:all 0.4s cubic-bezier(0.4,0,0.2,1);
  box-shadow:0 2px 6px rgba(0,0,0,0.3);
  display:flex;align-items:center;justify-content:center;font-size:12px;
}
[data-theme="light"] .theme-toggle .toggle-knob{left:29px}
.theme-toggle .toggle-icon{position:absolute;top:50%;transform:translateY(-50%);font-size:12px;transition:opacity 0.3s ease;pointer-events:none}
.theme-toggle .icon-moon{left:7px;opacity:1}
.theme-toggle .icon-sun{right:7px;opacity:0.4}
[data-theme="light"] .theme-toggle .icon-moon{opacity:0.4}
[data-theme="light"] .theme-toggle .icon-sun{opacity:1}

[data-theme="light"] .nav-card-title{color:var(--text)}
[data-theme="light"] .nav-card-link{color:rgba(26,26,46,0.7);background:rgba(0,0,0,0.02)}
[data-theme="light"] .nav-card-link:hover{color:var(--text);background:rgba(0,0,0,0.05)}
[data-theme="light"] .particle{opacity:0.08}
[data-theme="light"] .cursor-glow{background:radial-gradient(circle, rgba(255,106,0,0.04) 0%, rgba(255,106,0,0.015) 30%, transparent 70%)}
[data-theme="light"] .hero-title .sub3{color:rgba(26,26,46,0.25)}
[data-theme="light"] .tick-item{color:var(--muted2)}
[data-theme="light"] .nav-card-dark{background:var(--surface) !important}
[data-theme="light"] .nav-card-dark .nav-card-glow{opacity:0.3}

/* ── NAV MENU OVERLAY ── */
#nav-menu{position:fixed;inset:0;top:70px;z-index:190;pointer-events:none;overflow:hidden}
#nav-backdrop{position:absolute;inset:0;background:var(--nav-backdrop);backdrop-filter:blur(12px);opacity:0;transition:opacity 0.4s ease, background 0.4s ease}
.nav-cards{position:absolute;top:0;left:0;right:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:24px;opacity:0;pointer-events:none;max-width:1000px;margin:0 auto}

.nav-card{
  border-radius:18px;padding:26px 24px;overflow:hidden;position:relative;cursor:pointer;
  border:1px solid var(--glass-border);background:var(--glass-bg);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:var(--shadow-card);
  transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
}
.nav-card::before{content:'';position:absolute;inset:0;background:var(--glass-highlight);pointer-events:none;border-radius:inherit}
.nav-card:hover{border-color:var(--border2);box-shadow:var(--shadow-hover);transform:translateY(-4px)}
.nav-card-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;color:#fff;margin-bottom:20px;display:flex;align-items:center;gap:8px;position:relative;z-index:1}
.nav-card-title-arrow{opacity:0.4;font-size:16px;transition:all 0.3s}
.nav-card:hover .nav-card-title-arrow{opacity:1;transform:translateX(4px);color:var(--orange)}
.nav-card-links{display:flex;flex-direction:column;gap:6px;position:relative;z-index:1}
.nav-card-link{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;text-decoration:none;font-size:13px;color:rgba(255,255,255,0.65);transition:all 0.25s;background:rgba(255,255,255,0.02);border:1px solid transparent}
[data-theme="light"] .nav-card-link{color:rgba(26,26,46,0.7);background:rgba(0,0,0,0.02)}
.nav-card-link:hover{background:rgba(255,255,255,0.06);color:#fff;padding-left:18px;border-color:var(--border);box-shadow:var(--shadow-card)}
[data-theme="light"] .nav-card-link:hover{background:rgba(0,0,0,0.05);color:var(--text)}
.nav-card-link-icon{font-size:11px;opacity:0.5}
.nav-card-glow{position:absolute;bottom:-40px;right:-40px;width:120px;height:120px;border-radius:50%;filter:blur(45px);opacity:0;transition:opacity 0.4s}
.nav-card:hover .nav-card-glow{opacity:0.6}

#waves-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.2s ease}
#waves-canvas.loaded{opacity:1}

/* ── HERO ── */
.hero{
  position:relative;z-index:1;min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:140px 24px 100px;overflow:hidden;
  background:linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:500px;background:radial-gradient(ellipse, var(--orange-dim) 0%, transparent 70%);pointer-events:none;opacity:0.5}
.hero-content{
  position:relative;z-index:2;
  background:var(--glass-bg);
  backdrop-filter:blur(24px) saturate(150%);
  -webkit-backdrop-filter:blur(24px) saturate(150%);
  border:1px solid var(--glass-border);
  border-radius:28px;padding:56px 50px;
  box-shadow:var(--shadow-float);max-width:760px;width:100%;
}
.hero-content::before{content:'';position:absolute;inset:0;background:var(--glass-highlight);border-radius:inherit;pointer-events:none}

.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--orange-dim);border:1px solid var(--border2);border-radius:100px;padding:7px 20px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--orange3);font-weight:500;margin-bottom:32px;opacity:0;box-shadow:var(--shadow-card)}
.eye-dot{width:6px;height:6px;background:var(--orange);border-radius:50%;animation:blink 1.5s ease-in-out infinite;box-shadow:0 0 8px var(--orange)}
@keyframes blink{0%,100%{opacity:1;box-shadow:0 0 8px var(--orange)}50%{opacity:0.3;box-shadow:0 0 4px var(--orange)}}

.hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,8vw,96px);font-weight:400;line-height:0.94;letter-spacing:2px;opacity:0}
.hero-title .grad{display:block;background:linear-gradient(90deg,var(--orange) 0%,var(--orange2) 40%,#ffcc99 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 35px rgba(255,106,0,0.35))}
.hero-sub{font-size:16px;color:var(--muted2);max-width:540px;margin:24px auto 0;font-weight:300;line-height:1.75;opacity:0}

/* ── ACTION BOX ── */
.action-box{
  margin:38px auto 0;max-width:480px;opacity:0;
  background:var(--surface);border:1px solid var(--border);
  border-radius:18px;padding:24px;
  box-shadow:var(--shadow-card);position:relative;overflow:hidden;
}
.action-box::before{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none;border-radius:inherit}
.action-label{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--orange3);font-weight:500;margin-bottom:12px;text-align:left;position:relative;z-index:1}
.action-input{
  width:100%;padding:15px 18px;border-radius:12px;
  background:var(--bg);border:1px solid var(--border);
  color:var(--text);font-size:15px;font-family:'DM Sans',sans-serif;
  box-shadow:var(--shadow-pressed);outline:none;margin-bottom:14px;
  transition:border-color 0.3s, box-shadow 0.3s;position:relative;z-index:1;
}
.action-input::placeholder{color:var(--muted)}
.action-input:focus{border-color:var(--border-glow);box-shadow:var(--shadow-pressed), 0 0 0 3px var(--orange-dim)}
.action-btn{
  width:100%;background:linear-gradient(135deg,var(--orange),var(--orange2));
  color:#fff;padding:15px 22px;border-radius:12px;font-size:15px;font-weight:500;
  border:none;cursor:pointer;text-decoration:none;
  display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:var(--shadow-card), 0 0 20px var(--orange-glow);
  position:relative;overflow:hidden;z-index:1;
  transition:all 0.35s cubic-bezier(0.4,0,0.2,1);will-change:transform;
}
.action-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);transform:translateX(-100%);transition:transform 0.6s}
.action-btn::after{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.action-btn:hover::before{transform:translateX(100%)}
.action-btn:hover{box-shadow:var(--shadow-hover), 0 0 35px rgba(255,106,0,0.45);transform:translateY(-3px)}
.action-btn:active{box-shadow:var(--shadow-pressed);transform:translateY(0)}

.btn-primary{
  background:linear-gradient(135deg,var(--orange),var(--orange2));color:#fff;
  padding:15px 32px;border-radius:12px;font-size:15px;font-weight:500;text-decoration:none;
  box-shadow:var(--shadow-card), 0 0 20px var(--orange-glow);
  display:flex;align-items:center;gap:8px;position:relative;overflow:hidden;
  transition:all 0.35s cubic-bezier(0.4,0,0.2,1);will-change:transform;border:none;cursor:pointer;
}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);transform:translateX(-100%);transition:transform 0.6s}
.btn-primary::after{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.btn-primary:hover::before{transform:translateX(100%)}
.btn-primary:hover{box-shadow:var(--shadow-hover), 0 0 35px rgba(255,106,0,0.45);transform:translateY(-3px)}
.btn-primary:active{box-shadow:var(--shadow-pressed);transform:translateY(0)}

.magnetic{will-change:transform}

/* ── TICKER ── */
.ticker-wrap{position:relative;z-index:1;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:16px 0;background:var(--glass-bg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:var(--shadow-pressed)}
.ticker{display:flex;gap:60px;animation:tick 22s linear infinite;white-space:nowrap;width:max-content}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.tick-item{color:var(--muted);font-size:12px;letter-spacing:2px;text-transform:uppercase;display:flex;align-items:center;gap:10px}
.tick-item span{color:var(--orange);text-shadow:0 0 8px var(--orange-glow)}

/* ── STATS ── */
.stats-row{position:relative;z-index:1;display:flex;justify-content:center;flex-wrap:wrap;gap:16px;padding:20px 0;border-bottom:1px solid var(--border)}
.stat-block{flex:1;min-width:150px;max-width:220px;padding:36px 28px;text-align:center;background:var(--surface);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow-card);transition:all 0.35s cubic-bezier(0.4,0,0.2,1);cursor:default;position:relative;overflow:hidden}
.stat-block::before{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.stat-block:hover{box-shadow:var(--shadow-hover);transform:translateY(-4px);border-color:var(--border2)}
.stat-num{font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:1px;color:var(--orange);text-shadow:0 0 20px var(--orange-glow), 0 0 40px rgba(255,106,0,0.15)}
.stat-label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:6px}

/* ── SECTIONS ── */
section{position:relative;z-index:1}
.section-tag{display:inline-block;background:var(--orange-dim);border:1px solid var(--border2);color:var(--orange3);font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;border-radius:100px;margin-bottom:18px;box-shadow:var(--shadow-card)}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,5vw,60px);font-weight:400;letter-spacing:1.5px;line-height:1.05}
.section-sub{color:var(--muted2);font-size:15px;font-weight:300;margin-top:12px;max-width:480px;line-height:1.7}
.container{max-width:1120px;margin:0 auto;padding:0 24px}
.py{padding:100px 0}

/* ── FEATURES ── */
.steps-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:60px}
.step{padding:40px 30px;background:var(--surface);border:1px solid var(--border);border-radius:18px;box-shadow:var(--shadow-card);transition:all 0.4s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden}
.step::before{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none;border-radius:inherit}
.step::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--orange),var(--orange2),transparent);opacity:0;transition:opacity 0.35s}
.step:hover{box-shadow:var(--shadow-hover);transform:translateY(-6px);border-color:var(--border2)}
.step:hover::after{opacity:1}
.step-n{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2px;color:var(--orange);margin-bottom:22px;position:relative;z-index:1}
.step-ico{width:56px;height:56px;background:var(--orange-dim);border:1px solid var(--border2);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:22px;box-shadow:var(--shadow-card);transition:all 0.4s cubic-bezier(0.4,0,0.2,1);position:relative;z-index:1}
.step:hover .step-ico{transform:scale(1.12) rotate(-5deg);box-shadow:var(--shadow-neon)}
.step h3{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.5px;margin-bottom:12px;position:relative;z-index:1}
.step p{color:var(--muted2);font-size:14px;line-height:1.7;font-weight:300;position:relative;z-index:1}

/* ── CONTACT STRIP ── */
.contact-strip{border:1px solid var(--border);border-radius:18px;background:var(--surface);padding:34px 38px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;margin-top:48px;box-shadow:var(--shadow-card);transition:all 0.4s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden}
.contact-strip::before{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.contact-strip:hover{box-shadow:var(--shadow-hover);transform:translateY(-4px);border-color:var(--border2)}
.contact-strip h4{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.5px;position:relative;z-index:1}
.contact-strip p{color:var(--muted2);font-size:13px;font-weight:300;position:relative;z-index:1}
.tg-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--orange),var(--orange2));color:#fff;padding:13px 24px;border-radius:12px;font-size:14px;font-weight:500;text-decoration:none;box-shadow:var(--shadow-card), 0 0 15px var(--orange-glow);white-space:nowrap;position:relative;overflow:hidden;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);will-change:transform}
.tg-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transform:translateX(-100%);transition:transform 0.5s}
.tg-btn::after{content:'';position:absolute;inset:0;background:var(--light-reflection);pointer-events:none}
.tg-btn:hover::before{transform:translateX(100%)}
.tg-btn:hover{box-shadow:var(--shadow-hover), 0 0 25px rgba(255,106,0,0.35);transform:translateY(-3px)}
.tg-btn:active{box-shadow:var(--shadow-pressed);transform:translateY(0)}

/* ── CTA BANNER ── */
.cta-banner{border:1px solid var(--border2);border-radius:26px;padding:80px 44px;text-align:center;margin:80px 0;position:relative;overflow:hidden;background:var(--glass-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:var(--shadow-float);transition:all 0.4s cubic-bezier(0.4,0,0.2,1)}
.cta-banner::before{content:'';position:absolute;inset:0;background:var(--glass-highlight);pointer-events:none;border-radius:inherit}
.cta-banner::after{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:400px;height:250px;background:rgba(255,106,0,0.12);border-radius:50%;filter:blur(70px);animation:ctaGlow 4s ease-in-out infinite}
@keyframes ctaGlow{0%,100%{opacity:0.6;transform:translateX(-50%) scale(1)}50%{opacity:1;transform:translateX(-50%) scale(1.12)}}
.cta-banner:hover{box-shadow:var(--shadow-hover), 0 0 50px rgba(255,106,0,0.2);transform:translateY(-4px)}
.cta-banner .section-title{position:relative;font-size:clamp(36px,5vw,70px)}
.cta-banner p{color:var(--muted2);font-size:16px;font-weight:300;margin-top:14px;position:relative}
.cta-banner .btn-primary{display:inline-flex;margin-top:38px;position:relative}

/* ── FOOTER ── */
footer{border-top:1px solid var(--border);padding:36px 56px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;position:relative;z-index:1;background:var(--glass-bg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
footer p{color:var(--muted);font-size:13px}
.foot-links{display:flex;gap:28px;list-style:none}
.foot-links a{color:var(--muted);font-size:13px;text-decoration:none;transition:color 0.3s}
.foot-links a:hover{color:var(--orange2);text-shadow:0 0 8px var(--orange-glow)}

/* ── TRUST BANNER ── */
.trust-banner{text-align:center;padding:40px 24px 60px;position:relative;z-index:1}
.trust-banner p{color:var(--muted2);font-size:14px;font-weight:300;max-width:600px;margin:0 auto;line-height:1.8}
.trust-banner strong{color:var(--orange3);font-weight:500}

/* ── SCROLL REVEAL ── */
.reveal{opacity:0;transform:translateY(24px);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.4,0,0.2,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.d1{transition-delay:0.1s}.d2{transition-delay:0.2s}.d3{transition-delay:0.3s}.d4{transition-delay:0.4s}

.particle{position:fixed;width:4px;height:4px;background:var(--orange);border-radius:50%;pointer-events:none;z-index:0;opacity:0.15;box-shadow:0 0 8px var(--orange), 0 0 16px var(--orange-glow);will-change:transform}
.cursor-glow{position:fixed;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle, rgba(255,106,0,0.08) 0%, rgba(255,106,0,0.03) 30%, transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);will-change:transform;opacity:0;transition:opacity 0.4s;filter:blur(8px)}

.light-reflection{position:absolute;width:200%;height:200%;top:-50%;left:-50%;background:radial-gradient(ellipse at var(--light-x, 30%) var(--light-y, 30%), rgba(255,255,255,0.06) 0%, transparent 50%);pointer-events:none;opacity:0;transition:opacity 0.4s}
.tilt-card:hover .light-reflection{opacity:1}

#scroll-bar{position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,var(--orange),var(--orange2),var(--orange3));z-index:300;transition:width 0.1s linear;box-shadow:0 0 8px var(--orange-glow), 0 0 2px rgba(255,255,255,0.2)}

#back-top{position:fixed;bottom:32px;right:32px;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle at 35% 30%,var(--orange2),var(--orange) 50%,var(--orange-dim) 100%);border:2px solid var(--border2);box-shadow:0 6px 20px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3);color:var(--text);font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:scale(0.8) translateY(10px);transition:opacity 0.3s, transform 0.3s;z-index:500;font-weight:700}
#back-top.visible{opacity:1;transform:scale(1) translateY(0)}
#back-top:hover{transform:scale(1.08) translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.3)}
#back-top:active{transform:scale(0.95)}

nav{transform:translateZ(0)}
.btn-primary,.step,.tilt-card{will-change:transform}
.step{contain:layout style}
button,a{-webkit-tap-highlight-color:transparent;touch-action:manipulation}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important}
  .ticker{animation:none}
  .reveal{opacity:1 !important;transform:none !important}
}
@supports not (backdrop-filter:blur(1px)){#nav-backdrop{background:rgba(10,5,0,0.92)}}

@keyframes shimmer-once{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
.btn-primary .shimmer,.action-btn .shimmer{position:absolute;top:0;left:0;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,240,180,0.2),transparent);transform:translateX(-100%);pointer-events:none}
.btn-primary.shimmer-play .shimmer,.action-btn.shimmer-play .shimmer{animation:shimmer-once 0.8s ease forwards}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  nav{padding:0 20px;height:64px;grid-template-columns:auto 1fr auto}
  .logo{font-size:22px;justify-content:flex-start;margin-left:12px}
  .nav-cards{grid-template-columns:1fr;padding:16px;gap:10px}
  .steps-wrap{grid-template-columns:1fr;gap:14px;margin-top:40px}
  .step{padding:32px 26px}
  footer{padding:28px 20px;flex-direction:column;text-align:center}
  .cursor-glow{display:none}
  .hero-content{padding:42px 28px;border-radius:22px}
  .hero{padding:100px 20px 60px}
  .stats-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:20px 16px}
  .stat-block{max-width:100%;width:100%;padding:28px 20px}
  .stat-num{font-size:40px}
  .contact-strip{flex-direction:column;text-align:center}
  .section-title{font-size:clamp(28px,5vw,60px)}
}
@media(max-width:600px){
  .hero{padding:88px 16px 50px}
  .hero-content{padding:32px 20px;border-radius:18px}
  .hero-title{font-size:clamp(40px,11vw,72px);line-height:0.96}
  .hero-sub{font-size:14px;margin-top:18px}
  .hero-eyebrow{font-size:9px;padding:5px 12px;margin-bottom:22px}
  .action-box{padding:20px;margin-top:30px}
  .steps-wrap{grid-template-columns:1fr;gap:12px}
  .step{padding:28px 22px}
  .stats-row{grid-template-columns:1fr 1fr;gap:10px;padding:16px}
  .stat-block{padding:22px 16px;border-radius:14px}
  .stat-num{font-size:34px}
  .stat-label{font-size:10px}
  .cta-banner{padding:52px 20px;margin:50px 0;border-radius:20px}
  .cta-banner .section-title{font-size:clamp(28px,9vw,50px)}
  .cta-banner p{font-size:14px}
  .cta-banner .btn-primary{margin-top:28px;width:100%;justify-content:center}
  footer{padding:24px 16px;flex-direction:column;align-items:center;text-align:center;gap:16px}
  .foot-links{flex-wrap:wrap;justify-content:center;gap:14px 20px}
  footer p{font-size:12px}
  .py{padding:70px 0}
  .container{padding:0 16px}
  .nav-card{padding:20px 18px}
  .nav-card-title{font-size:18px}
}
@media(max-width:480px){
  body::after{inset:4px}
  nav{height:58px;padding:0 14px;grid-template-columns:auto 1fr auto}
  .logo{font-size:18px;letter-spacing:1px}
  .logo-icon{width:26px;height:26px;border-radius:8px}
  .logo-icon svg{width:14px;height:14px}
  .nav-cta{padding:8px 14px;font-size:12px;border-radius:8px}
  #back-top{bottom:20px;right:20px;width:42px;height:42px;font-size:16px}
}
@media(max-width:380px){.nav-cta{display:none}.hero-title{font-size:38px}}

@media(pointer:coarse){
  .nav-card-link{min-height:44px}
  .btn-primary,.nav-cta,.action-btn{min-height:48px}
  .ham-btn{width:48px;height:48px}
}
@supports(padding:max(0px)){
  nav{padding-left:max(20px,env(safe-area-inset-left));padding-right:max(20px,env(safe-area-inset-right))}
  footer{padding-bottom:max(24px,env(safe-area-inset-bottom))}
  #back-top{bottom:max(20px,calc(env(safe-area-inset-bottom) + 12px));right:max(20px,env(safe-area-inset-right))}
}

/* ── CUSTOM CURSOR ── */
*{cursor:none !important}
#cursor-outer{position:fixed;width:36px;height:36px;border-radius:50%;border:2px solid var(--orange);background:transparent;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width 0.25s ease,height 0.25s ease,background 0.25s ease,border-color 0.25s ease,opacity 0.3s ease;box-shadow:0 0 12px var(--orange-glow),inset 0 0 8px rgba(255,106,0,0.1);will-change:transform;top:0;left:0}
#cursor-inner{position:fixed;width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 35%,var(--orange2),var(--orange));pointer-events:none;z-index:99999;transform:translate(-50%,-50%);top:0;left:0;box-shadow:0 0 8px var(--orange),0 2px 4px rgba(0,0,0,0.5),inset 0 1px 2px rgba(255,230,150,0.4);will-change:transform;transition:width 0.12s ease,height 0.12s ease,opacity 0.3s ease}
body.cursor-hover #cursor-outer{width:52px;height:52px;border-color:var(--orange2);background:rgba(255,106,0,0.08);box-shadow:0 0 24px rgba(255,106,0,0.5),inset 0 0 14px rgba(255,106,0,0.15)}
body.cursor-hover #cursor-inner{width:5px;height:5px}
body.cursor-click #cursor-outer{width:28px;height:28px;background:rgba(255,106,0,0.22);border-color:var(--orange2);box-shadow:0 0 20px rgba(255,192,112,0.6),inset 0 0 10px rgba(255,106,0,0.3)}
body.cursor-click #cursor-inner{width:10px;height:10px;background:radial-gradient(circle at 35% 35%,var(--orange2),var(--orange3))}
body.cursor-text #cursor-outer{width:3px;height:28px;border-radius:2px;border-width:0;background:var(--orange);box-shadow:0 0 10px var(--orange)}
body.cursor-text #cursor-inner{opacity:0}
body.cursor-hidden #cursor-outer,body.cursor-hidden #cursor-inner{opacity:0}
@media(pointer:coarse){#cursor-outer,#cursor-inner{display:none}*{cursor:auto !important}}
</style>
</head>
<body>
<div id="cursor-outer"></div>
<div id="cursor-inner"></div>
<div id="scroll-bar"></div>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>
<div class="cursor-glow" id="cursorGlow"></div>

<!-- NAV MENU OVERLAY -->
<div id="nav-menu">
  <div id="nav-backdrop"></div>
  <div class="nav-cards" id="navCards">
    <div class="nav-card nav-card-dark" data-href="#how">
      <div class="nav-card-glow" style="background:rgba(255,107,26,0.5)"></div>
      <div class="nav-card-title">How It Works <span class="nav-card-title-arrow">↗</span></div>
      <div class="nav-card-links">
        <a href="#how" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Set Your Identity</a>
        <a href="#how" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Drop Your Track</a>
        <a href="#how" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Track Status & Growth</a>
      </div>
    </div>
    <div class="nav-card nav-card-dark" data-href="#features">
      <div class="nav-card-glow" style="background:rgba(255,100,20,0.5)"></div>
      <div class="nav-card-title">Why Spilrix <span class="nav-card-title-arrow">↗</span></div>
      <div class="nav-card-links">
        <a href="#features" class="nav-card-link"><span class="nav-card-link-icon">↳</span> No Passwords</a>
        <a href="#features" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Error-Free Uploads</a>
        <a href="#features" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Real-Time Status</a>
      </div>
    </div>
    <div class="nav-card nav-card-dark" data-href="#launch">
      <div class="nav-card-glow" style="background:rgba(230,90,10,0.5)"></div>
      <div class="nav-card-title">Get Started <span class="nav-card-title-arrow">↗</span></div>
      <div class="nav-card-links">
        <a href="#launch" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Enter Artist Name</a>
        <a href="#launch" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Launch Dashboard</a>
        <a href="#launch" class="nav-card-link"><span class="nav-card-link-icon">↳</span> Upload Instantly</a>
      </div>
    </div>
  </div>
</div>

<!-- NAV -->
<nav role="navigation">
  <button class="ham-btn magnetic" id="hamBtn" aria-label="Menu" aria-expanded="false">
    <span class="ham-line"></span>
    <span class="ham-line"></span>
    <span class="ham-line"></span>
  </button>

  <a href="#" class="logo">
    <span class="logo-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    </span>
    SPILRIX <span>DISTRIBUTION</span>
  </a>

  <div class="nav-right">
    <div class="theme-toggle-wrap">
      <div class="theme-toggle" id="themeToggle" role="button" aria-label="Toggle theme" tabindex="0">
        <span class="toggle-icon icon-moon">🌙</span>
        <span class="toggle-icon icon-sun">☀️</span>
        <div class="toggle-knob"></div>
      </div>
    </div>
    <a href="#launch" class="nav-cta magnetic">Launch 🚀</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero" id="launch">
  <canvas id="waves-canvas"></canvas>
  <div class="hero-content">
    <div class="hero-eyebrow"><div class="eye-dot"></div> Independent Music Distribution · 2025</div>
    <h1 class="hero-title">
      YOUR MUSIC.<br/>
      EVERYWHERE.<br/>
      <span class="grad">INSTANTLY.</span>
    </h1>
    <p class="hero-sub">Streamline your sound. Spilrix Distribution helps independent artists upload tracks to global platforms without the usual friction. No complex setups, no endless forms—just your music, delivered.</p>

    <div class="action-box">
      <div class="action-label">What is your Artist Name?</div>
      <input type="text" class="action-input" id="artistInput" placeholder="e.g., Lil Pixels, DJ Spilrix..." autocomplete="off" />
      <button class="action-btn magnetic" id="launchBtn" onclick="launchDashboard()">
        <span class="shimmer"></span>
        Launch Dashboard 🚀
      </button>
    </div>
  </div>
</section>

<!-- TICKER -->
<div class="ticker-wrap">
  <div class="ticker">
    <div class="tick-item">Spotify <span>✦</span></div>
    <div class="tick-item">Apple Music <span>✦</span></div>
    <div class="tick-item">YouTube Music <span>✦</span></div>
    <div class="tick-item">Amazon Music <span>✦</span></div>
    <div class="tick-item">Tidal <span>✦</span></div>
    <div class="tick-item">Deezer <span>✦</span></div>
    <div class="tick-item">Instant Upload <span>✦</span></div>
    <div class="tick-item">Global Delivery <span>✦</span></div>
    <div class="tick-item">Spotify <span>✦</span></div>
    <div class="tick-item">Apple Music <span>✦</span></div>
    <div class="tick-item">YouTube Music <span>✦</span></div>
    <div class="tick-item">Amazon Music <span>✦</span></div>
    <div class="tick-item">Tidal <span>✦</span></div>
    <div class="tick-item">Deezer <span>✦</span></div>
    <div class="tick-item">Instant Upload <span>✦</span></div>
    <div class="tick-item">Global Delivery <span>✦</span></div>
  </div>
</div>

<!-- STATS -->
<div class="stats-row">
  <div class="stat-block reveal"><div class="stat-num">∞</div><div class="stat-label">Tracks Delivered</div></div>
  <div class="stat-block reveal d1"><div class="stat-num">0</div><div class="stat-label">Passwords Needed</div></div>
  <div class="stat-block reveal d2"><div class="stat-num">100%</div><div class="stat-label">Error-Free Uploads</div></div>
  <div class="stat-block reveal d3"><div class="stat-num">24/7</div><div class="stat-label">Status Tracking</div></div>
</div>

<!-- FEATURES / HOW IT WORKS -->
<section id="how" class="py">
  <div class="container">
    <div class="reveal" style="text-align:center">
      <div class="section-tag">Why Choose Spilrix?</div>
      <h2 class="section-title">SIMPLE BY DESIGN</h2>
      <p class="section-sub" style="margin:12px auto 0">Three simple steps to get your music on every major platform — no friction, no fuss.</p>
    </div>
    <div class="steps-wrap reveal" id="features">
      <div class="step tilt-card">
        <div class="step-n">STEP 01</div>
        <div class="step-ico">⚡</div>
        <h3>Set Your Identity</h3>
        <p>No passwords to forget. Just enter your unique artist name to unlock your personalized dashboard instantly.</p>
      </div>
      <div class="step tilt-card">
        <div class="step-n">STEP 02</div>
        <div class="step-ico">🎵</div>
        <h3>Drop Your Track</h3>
        <p>Upload high-quality WAV or MP3 files alongside your cover art using our lightweight, error-free upload system.</p>
      </div>
      <div class="step tilt-card">
        <div class="step-n">STEP 03</div>
        <div class="step-ico">📊</div>
        <h3>Track Status & Growth</h3>
        <p>Monitor your submission state (Pending, Approved, or Live) and view your stream milestones all in one clean place.</p>
      </div>
    </div>

    <div class="contact-strip reveal">
      <div>
        <h4>Ready To Get Your Sound Out There?</h4>
        <p>Enter your artist name above and launch your dashboard in seconds. Your music, everywhere — instantly.</p>
      </div>
      <a href="#launch" class="tg-btn magnetic">Launch Dashboard 🚀</a>
    </div>
  </div>
</section>

<!-- CTA BANNER -->
<section>
  <div class="container">
    <div class="cta-banner reveal">
      <h2 class="section-title">YOUR MUSIC<br/>DESERVES TO BE HEARD</h2>
      <p>Join the next generation of independent artists distributing worldwide with zero friction. No card. No forms. Just your name.</p>
      <a href="#launch" class="btn-primary magnetic">
        <span class="shimmer"></span>
        Launch Your Dashboard 🚀
      </a>
    </div>
  </div>
</section>

<!-- TRUST BANNER -->
<div class="trust-banner reveal">
  <p>Powering the next generation of independent sound. Secure audio storage powered by <strong>Supabase</strong> and ultra-fast delivery optimized via <strong>Vercel</strong>.</p>
</div>

<!-- FOOTER -->
<footer>
  <a href="#" class="logo" style="font-size:20px">
    <span class="logo-icon" style="width:28px;height:28px">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    </span>
    SPILRIX <span>DISTRIBUTION</span>
  </a>
  <ul class="foot-links">
    <li><a href="#launch">Launch</a></li>
    <li><a href="#how">How It Works</a></li>
    <li><a href="#features">Features</a></li>
  </ul>
  <p>© 2025 Spilrix Distribution · All rights reserved</p>
</footer>

<button id="back-top" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>

<script>
// ── Launch Dashboard (Enter Name → Save → Redirect) ──
function launchDashboard() {
  const input = document.getElementById('artistInput');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    input.style.borderColor = 'var(--red)';
    input.placeholder = '⚠ Please enter your artist name';
    gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
    return;
  }
  // Save artist name (same key as dashboard layout expects)
  localStorage.setItem('artist_name', name);
  // Redirect to dashboard
  window.location.href = '/dashboard/upload';
}
// Allow Enter key to launch
document.getElementById('artistInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') launchDashboard();
});
</script>

<script>
// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
</script>

<script>
// ── Hamburger CardNav — GSAP ──
(function() {
  const hamBtn = document.getElementById('hamBtn');
  const navMenu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('nav-backdrop');
  const cards = document.getElementById('navCards');
  const cardEls = document.querySelectorAll('.nav-card');
  const links = document.querySelectorAll('.nav-card-link');
  let isOpen = false, tl;

  function buildTimeline() {
    tl = gsap.timeline({ paused: true });
    tl.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power3.out' }, 0);
    tl.to(cards, { opacity: 1, duration: 0.01 }, 0);
    tl.fromTo(cardEls, { opacity: 0, y: -35, scaleY: 0.9, scaleX: 0.97, transformOrigin: 'top center' }, { opacity: 1, y: 0, scaleY: 1, scaleX: 1, duration: 0.55, ease: 'expo.out', stagger: 0.08 }, 0.05);
    tl.fromTo(links, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', stagger: 0.035 }, 0.3);
  }
  function openMenu() {
    isOpen = true; hamBtn.classList.add('active'); hamBtn.setAttribute('aria-expanded', 'true');
    navMenu.style.pointerEvents = 'all'; cards.style.pointerEvents = 'all'; backdrop.style.pointerEvents = 'all';
    if (!tl) buildTimeline(); tl.play();
  }
  function closeMenu() {
    isOpen = false; hamBtn.classList.remove('active'); hamBtn.setAttribute('aria-expanded', 'false');
    gsap.to([cards, backdrop], { opacity: 0, duration: 0.28, ease: 'power3.in', onComplete: () => {
      navMenu.style.pointerEvents = 'none'; cards.style.pointerEvents = 'none'; backdrop.style.pointerEvents = 'none';
      gsap.set(cardEls, { opacity: 0, y: -35, scaleY: 0.9, scaleX: 0.97 });
      gsap.set(links, { opacity: 0, x: -14 }); tl = null;
    }});
  }
  hamBtn.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeMenu(); });
  window.addEventListener('scroll', () => { if (isOpen) closeMenu(); }, { passive: true });
  document.querySelectorAll('.nav-card-link').forEach(link => { link.addEventListener('click', () => { if (isOpen) closeMenu(); }); });
  links.forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link, { x: 5, duration: 0.2, ease: 'power2.out' }));
    link.addEventListener('mouseleave', () => gsap.to(link, { x: 0, duration: 0.2, ease: 'power2.out' }));
  });
  gsap.set(cardEls, { opacity: 0, y: -28, scaleY: 0.88, scaleX: 0.96 });
  gsap.set(links, { opacity: 0, x: -10 });
  gsap.set(cards, { opacity: 0, pointerEvents: 'none' });
  gsap.set(backdrop, { opacity: 0, pointerEvents: 'none' });
})();
</script>

<script>
// ── Hero Entrance Animations ──
(function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileAnim = window.innerWidth <= 600;
  if (!prefersReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: isMobileAnim ? 0.5 : 0.8, delay: 0.3 })
      .to('.hero-title', { opacity: 1, y: 0, duration: isMobileAnim ? 0.6 : 0.9 }, '-=0.4')
      .to('.hero-sub', { opacity: 1, y: 0, duration: isMobileAnim ? 0.5 : 0.8 }, '-=0.5')
      .to('.action-box', { opacity: 1, y: 0, duration: isMobileAnim ? 0.5 : 0.8 }, '-=0.45');
    gsap.set(['.hero-eyebrow', '.hero-title', '.hero-sub', '.action-box'], { y: isMobileAnim ? 20 : 40, opacity: 0 });
    gsap.fromTo('.hero-content', { opacity: 0, scale: isMobileAnim ? 0.97 : 0.95, y: isMobileAnim ? 15 : 30 }, { opacity: 1, scale: 1, y: 0, duration: isMobileAnim ? 0.8 : 1.2, ease: 'expo.out', delay: 0.1 });
    tl.then(() => { setTimeout(() => { document.querySelectorAll('.action-btn').forEach(btn => btn.classList.add('shimmer-play')); }, 1200); });
  } else {
    document.querySelectorAll('.hero-eyebrow, .hero-title, .hero-sub, .action-box').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    gsap.set('.hero-content', { opacity: 1, scale: 1, y: 0 });
  }
})();
</script>

<script>
// ── Tilt Card Effect ──
(function() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    const reflection = document.createElement('div');
    reflection.className = 'light-reflection';
    card.style.position = 'relative'; card.style.overflow = 'hidden';
    card.appendChild(reflection);
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rotateX = ((y - rect.height/2) / (rect.height/2)) * -4;
      const rotateY = ((x - rect.width/2) / (rect.width/2)) * 4;
      reflection.style.setProperty('--light-x', (x/rect.width)*100 + '%');
      reflection.style.setProperty('--light-y', (y/rect.height)*100 + '%');
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015,1.015,1.015)`;
      card.style.transition = 'transform 0.15s ease-out';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    });
  });
})();
</script>

<script>
// ── Magnetic Cursor + Glow ──
(function() {
  const magneticElements = document.querySelectorAll('.magnetic');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; if (cursorGlow) cursorGlow.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { if (cursorGlow) cursorGlow.style.opacity = '0'; });
  function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08; glowY += (mouseY - glowY) * 0.08;
    if (cursorGlow) { cursorGlow.style.left = glowX + 'px'; cursorGlow.style.top = glowY + 'px'; }
    requestAnimationFrame(updateCursorGlow);
  }
  updateCursorGlow();
  magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.03, duration: 0.35, ease: 'power3.out' }));
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - rect.left - rect.width/2) * 0.25, y: (e.clientY - rect.top - rect.height/2) * 0.25, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  });
})();
</script>

<script>
// ── Floating Particles ──
(function() {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random()*100+'vw'; p.style.top = Math.random()*100+'vh';
    p.style.width = (Math.random()*3+2)+'px'; p.style.height = p.style.width;
    document.body.appendChild(p);
    gsap.to(p, { y:'random(-100,100)', x:'random(-50,50)', duration:'random(8,15)', repeat:-1, yoyo:true, ease:'sine.inOut', delay:Math.random()*2 });
    gsap.to(p, { opacity:'random(0.05,0.2)', duration:'random(2,4)', repeat:-1, yoyo:true, ease:'sine.inOut' });
  }
})();
</script>

<script>
// ── Parallax Orbs ──
(function() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => gsap.to(orb, { y: scrollY*(i+1)*0.05, duration: 0.5, ease: 'power2.out' }));
  }, { passive: true });
})();
</script>

<script>
// ── Smooth Scroll ──
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });
})();
</script>

<script>
// ── Stats Counter ──
(function() {
  const statNums = document.querySelectorAll('.stat-num');
  let animated = false;
  function animateCounter(el, target, duration = 1200) {
    const numTarget = parseInt(target); if (isNaN(numTarget)) return;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * numTarget) + (target.includes('%') ? '%' : '');
      if (progress < 1) requestAnimationFrame(update); else el.textContent = target;
    }
    requestAnimationFrame(update);
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        if (statNums[2]) animateCounter(statNums[2], '100%', 1200);
        gsap.fromTo(statNums, { y:30, opacity:0, filter:'blur(4px)' }, { y:0, opacity:1, filter:'blur(0px)', duration:0.8, stagger:0.15, ease:'back.out(1.4)' });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) obs.observe(statsRow);
})();
</script>

<script>
// ── Theme Toggle ──
(function() {
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const KEY = 'spilrix-theme';
  function getSaved() { return localStorage.getItem(KEY) || 'dark'; }
  function apply(theme) { html.setAttribute('data-theme', theme); localStorage.setItem(KEY, theme); }
  apply(getSaved());
  function switchTheme() { apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
  if (toggle) {
    toggle.addEventListener('click', switchTheme);
    toggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchTheme(); } });
  }
})();
</script>

<script>
// ── Scroll Progress + Back to Top ──
(function() {
  const scrollBar = document.getElementById('scroll-bar');
  const backTop = document.getElementById('back-top');
  let rafPending = false;
  function update() {
    rafPending = false;
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
    if (backTop) backTop.classList.toggle('visible', scrollY > 400);
  }
  window.addEventListener('scroll', () => { if (!rafPending) { rafPending = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
</script>

<script>
// ── Custom Cursor ──
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  const body = document.body;
  let mouseX=0, mouseY=0, outerX=0, outerY=0;
  document.addEventListener('mousemove', (e) => { mouseX=e.clientX; mouseY=e.clientY; inner.style.left=mouseX+'px'; inner.style.top=mouseY+'px'; body.classList.remove('cursor-hidden'); });
  function animateOuter() { outerX += (mouseX-outerX)*0.12; outerY += (mouseY-outerY)*0.12; outer.style.left=outerX+'px'; outer.style.top=outerY+'px'; requestAnimationFrame(animateOuter); }
  animateOuter();
  const hoverTargets = 'a, button, .btn-primary, .action-btn, .action-input, .nav-cta, .ham-btn, .tg-btn, .step, .nav-card, [onclick], .magnetic, .theme-toggle';
  document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverTargets)) body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverTargets)) body.classList.remove('cursor-hover'); });
  const textTargets = 'p, h1, h2, h3, h4, span, li, .section-sub, .hero-sub';
  document.addEventListener('mouseover', (e) => { if (e.target.closest(textTargets) && !e.target.closest(hoverTargets)) body.classList.add('cursor-text'); });
  document.addEventListener('mouseout', (e) => { if (e.target.closest(textTargets)) body.classList.remove('cursor-text'); });
  document.addEventListener('mousedown', () => { body.classList.add('cursor-click'); body.classList.remove('cursor-hover'); });
  document.addEventListener('mouseup', () => body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => body.classList.remove('cursor-hidden'));
})();
</script>

<script>
// ── Waves Animation (Hero) ──
(function () {
  const canvas = document.getElementById('waves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth <= 600;
  const CFG = { lineColor:'#ff8533', speedX:0.0125, speedY:0.01, ampX:isMobile?25:40, ampY:isMobile?12:20, friction:0.9, tension:0.01, maxCursorMove:isMobile?60:120, xGap:isMobile?22:12, yGap:isMobile?55:36 };
  let W, H, lines = [], mouse = { x:-999, y:-999 };
  function Point(x,y){ this.x=x;this.y=y;this.ox=x;this.oy=y;this.vx=0;this.vy=0; }
  function Line(y){ this.points=[]; for(let x=0;x<=W;x+=CFG.xGap) this.points.push(new Point(x,y)); }
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; buildLines(); }
  function buildLines(){ lines=[]; for(let y=0;y<=H;y+=CFG.yGap) lines.push(new Line(y)); }
  function update(){
    const time = Date.now()*0.001;
    lines.forEach((line,li)=>{ line.points.forEach((p,pi)=>{
      let fx=(p.ox-p.x)*CFG.tension, fy=(p.oy-p.y)*CFG.tension;
      fx+=Math.sin(pi*0.3+time*CFG.speedX*80)*CFG.ampX*0.012;
      fy+=Math.sin(li*0.4+time*CFG.speedY*80)*CFG.ampY*0.012;
      const dx=p.x-mouse.x, dy=p.y-mouse.y, dist=Math.sqrt(dx*dx+dy*dy), maxR=120;
      if(dist<maxR){ const force=(1-dist/maxR)*CFG.maxCursorMove*0.04; fx+=(dx/dist)*force; fy+=(dy/dist)*force; }
      p.vx=(p.vx+fx)*CFG.friction; p.vy=(p.vy+fy)*CFG.friction; p.x+=p.vx; p.y+=p.vy;
    });});
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.strokeStyle=CFG.lineColor; ctx.lineWidth=1; ctx.globalAlpha=0.45;
    lines.forEach(line=>{ const pts=line.points; if(pts.length<2)return;
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length-1;i++){ const mx=(pts[i].x+pts[i+1].x)/2, my=(pts[i].y+pts[i+1].y)/2; ctx.quadraticCurveTo(pts[i].x,pts[i].y,mx,my); }
      ctx.lineTo(pts[pts.length-1].x,pts[pts.length-1].y); ctx.stroke();
    });
    ctx.globalAlpha=1;
  }
  function tick(){ update(); draw(); requestAnimationFrame(tick); }
  function getPos(e){ const rect=canvas.getBoundingClientRect(); const src=e.touches?e.touches[0]:e; return { x:src.clientX-rect.left, y:src.clientY-rect.top }; }
  const hero = canvas.closest('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e=>{ const pos=getPos(e); mouse.x=pos.x; mouse.y=pos.y; });
    hero.addEventListener('mouseleave', ()=>{ mouse.x=-999; mouse.y=-999; });
    hero.addEventListener('touchmove', e=>{ const pos=getPos(e); mouse.x=pos.x; mouse.y=pos.y; }, { passive:true });
  }
  window.addEventListener('resize', resize);
  resize(); tick();
  setTimeout(() => canvas.classList.add('loaded'), 300);
})();
</script>

</body>
</html>
