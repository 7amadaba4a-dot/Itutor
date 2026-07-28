<template>
    <div class="ww-zoom-workspace" :style="containerStyle">
        <iframe ref="zoomIframe" class="iframe-holder" :srcdoc="generateMeetingHtml"
            allow="camera *; microphone *; display-capture *; autoplay; fullscreen; microphone" allowfullscreen
            webkitallowfullscreen mozallowfullscreen />
        <div v-if="!content?.lessonId" class="placeholder">
            <div class="msg-box">
                <p>🚀 Tutorzy Workplace Engine</p>
                <small>Please bind Lesson ID to start</small>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
props: {
uid: { type: String, required: true },
content: { type: Object, required: true },
},
emits: ['trigger-event'],
data() {
return {
_msgHandler: null,
_initialLoadTimer: null,
};
},
computed: {
isEditing() {
// eslint-disable-next-line no-unreachable
return false;
},
containerStyle() {
return {
height: this.content?.roomHeight || '700px',
borderRadius: '14px',
overflow: 'hidden',
background: '#000',
};
},
generateMeetingHtml() {
const lessonId = this.content?.lessonId || 'tutorzy-live';
const isTeacher = this.content?.userRole === 'teacher';
const roomToken = this.content?.roomToken || '';
const roomSuffix = roomToken ? ('-' + roomToken) : '';
const myId = isTeacher ? lessonId + roomSuffix + '-teacher' : lessonId + roomSuffix + '-student';
const targetId = isTeacher ? lessonId + roomSuffix + '-student' : lessonId + roomSuffix + '-teacher';
const teacherName = this.content?.teacherName || 'Teacher';
const studentName = this.content?.studentName || 'Student';
const userName = isTeacher ? teacherName : studentName;
const remoteName = isTeacher ? studentName : teacherName;
const teacherPhotoUrl = this.content?.teacherPhotoUrl || '';
const studentPhotoUrl = this.content?.studentPhotoUrl || '';
const remotePhotoUrl = isTeacher ? studentPhotoUrl : teacherPhotoUrl;
const lessonTitle = this.content?.lessonTitle || '';
const lessonEndIso = this.content?.lessonEndIso || '';
const accent = this.content?.themeColor || '#007bff';
const barStyle = this.content?.toolbarStyle === 'solid' ? 'solid' : 'glass';
const enableWhiteboard = this.content?.enableWhiteboard !== false;
const enableScreenShare = this.content?.enableScreenShare !== false;
const enableChat = this.content?.enableChat !== false;
const enableRaiseHand = this.content?.enableRaiseHand !== false;
const enableReactions = this.content?.enableReactions !== false;
const enableFullscreen = this.content?.enableFullscreen !== false;
const showStatusBar = this.content?.showStatusBar !== false;
const enablePip = this.content?.enablePictureInPicture !== false;
const enablePipButton = this.content?.enablePipButton !== false;
const isAppMode = this.content?.isAppMode === true;
const iceServers = [
{ url: 'stun:stun.l.google.com:19302' },
{ url: 'stun:stun1.l.google.com:19302' },
];
if (this.content?.turnServerUrl) {
iceServers.push({
url: this.content.turnServerUrl,
username: this.content?.turnUsername || '',
credential: this.content?.turnCredential || '',
});
}
const iceServersJson = JSON.stringify(iceServers);
const initialsLocal = (userName || '?').trim().charAt(0).toUpperCase();
const initialsRemote = (remoteName || '?').trim().charAt(0).toUpperCase();

return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <link rel="stylesheet" href="https://esm.sh/@excalidraw/excalidraw@0.18.0/dist/dev/index.css">
    <script>
window.EXCALIDRAW_ASSET_PATH = "https://esm.sh/@excalidraw/excalidraw@0.18.0/dist/prod/";
    <\/script>
    <script type="importmap">
{
"imports": {
"react": "https://esm.sh/react@19.0.0",
"react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime",
"react-dom": "https://esm.sh/react-dom@19.0.0",
"react-dom/client": "https://esm.sh/react-dom@19.0.0/client"
}
}
    <\/script>
<style>
:root {
--accent:${accent};
--accent-glow:${accent}66}
* { box-sizing:border-box}
body, html { margin:0; padding:0; height:100%; background:#0a0a0c; overflow:hidden; color:white; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif}
.viewport { position:relative; width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden}
.prejoin-screen { position:fixed; inset:0; z-index:400; background:#0c0c0e; display:flex; align-items:center; justify-content:center}
.prejoin-card { width:100%; height:100%; max-width:none; background:#0c0c0e; border-radius:0; padding:48px; display:flex; flex-direction:row; gap:48px; align-items:center}
.prejoin-card h3 { color:white; font-size:15px; font-weight:500; margin:0 0 2px}
.prejoin-controls-col { flex:1; display:flex; flex-direction:column; gap:12px; min-width:0}
.prejoin-sub { font-size:12.5px; color:#8a8a8a; margin:0 0 4px}
.prejoin-video-wrap { flex:1.2; aspect-ratio:4/3; border-radius:14px; overflow:hidden; background:#000; position:relative; min-width:0}
.prejoin-video-wrap video { width:100%; height:100%; object-fit:cover; transform:scaleX(-1)}
.prejoin-row { display:flex; align-items:center; gap:10px}
.prejoin-mic-track { flex:1; height:9px; border-radius:5px; background:rgba(255,255,255,0.12); overflow:hidden; position:relative}
.prejoin-mic-bar { position:absolute; top:0; left:0; bottom:0; width:0%; background:#22c55e; transition:width .1s ease-out}
.prejoin-video-controls { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:8px; z-index:5}
.prejoin-mini-btn { width:34px; height:34px; border-radius:50%; background:rgba(0,0,0,0.55); color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; border:1px solid rgba(255,255,255,0.15)}
.prejoin-mini-btn.off { background:#dc2626; color:white}
.prejoin-dd-wrap { position:relative}
.prejoin-dd { flex:1; background:rgba(255,255,255,0.06); color:#e5e5e5; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:7px 10px; font-size:12.5px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:8px; position:relative}
.prejoin-dd span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.prejoin-dd i.fa-chevron-down { font-size:10px; color:#9ca3af; transition:transform .2s ease; flex:none}
.prejoin-dd.open i.fa-chevron-down { transform:rotate(180deg)}
.prejoin-dd-list { position:absolute; top:calc(100% + 6px); left:0; right:0; background:#1e1e22; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:4px; display:none; z-index:20; box-shadow:0 6px 18px rgba(0,0,0,0.4); max-height:160px; overflow-y:auto}
.prejoin-dd-list.show { display:block}
.prejoin-dd-list div { padding:8px 10px; font-size:12.5px; color:#e5e5e5; border-radius:6px; cursor:pointer; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.prejoin-dd-list div:hover { background:rgba(255,255,255,0.08)}
.prejoin-dd-list div.active { background:var(--accent); color:white}
.prejoin-hint { font-size:11.5px; color:#7a7a7a; margin:0}
.prejoin-join-btn { background:linear-gradient(135deg,#22c55e,#16a34a); color:white; border:none; border-radius:10px; padding:12px; font-size:14px; font-weight:500; cursor:pointer; margin-top:4px; transition:transform .15s ease, box-shadow .3s ease; animation:prejoinJoinGlow 2.2s ease-in-out infinite}
.prejoin-join-btn:hover:not(:disabled) { transform:scale(1.03); box-shadow:0 0 18px rgba(34,197,94,0.55)}
.prejoin-join-btn:disabled { opacity:.35; cursor:not-allowed; animation:none}
@keyframes prejoinJoinGlow { 0%,100% { box-shadow:0 0 0 0 rgba(34,197,94,0.35)} 50% { box-shadow:0 0 16px 3px rgba(34,197,94,0.4)} }
.prejoin-join-btn:disabled { opacity:.4; cursor:not-allowed}
.leave-confirm-modal { position:fixed; inset:0; z-index:410; background:rgba(0,0,0,0.55); display:none; align-items:center; justify-content:center}
.leave-confirm-card { width:300px; background:#1c1c20; border-radius:16px; padding:22px; text-align:center}
.leave-confirm-title { color:white; font-size:15px; font-weight:500; margin:0 0 6px}
.leave-confirm-sub { color:#9ca3af; font-size:12.5px; margin:0 0 18px}
.leave-confirm-actions { display:flex; gap:10px}
.leave-cancel-btn { flex:1; background:rgba(255,255,255,0.08); color:white; border:none; border-radius:9px; padding:10px; cursor:pointer; font-size:13px}
.leave-confirm-btn { flex:1; background:linear-gradient(135deg,#ef4444,#b91c1c); color:white; border:none; border-radius:9px; padding:10px; cursor:pointer; font-size:13px}
#remoteVideo { width:100%; height:100%; object-fit:cover; z-index:10; background:#101014}
.avatar-circle { position:absolute; inset:0; display:none; flex-direction:column; align-items:center; justify-content:center; gap:18px; z-index:15}
.avatar-circle.show { display:flex}
.circle { width:96px; height:96px; border-radius:50%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:36px; font-weight:600; color:rgba(255,255,255,0.85)}
.circle-photo { width:96px; height:96px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.2)}
.waiting-title { font-size:16px; font-weight:600; color:white; margin:0; text-align:center; padding:0 24px}
.local-wrap { position:absolute; top:96px; left:20px; z-index:50; width:210px; pointer-events:auto; cursor:grab}
.local-wrap.dragging { cursor:grabbing}
.local-wrap .lock-toggle { position:absolute; top:6px; right:6px; width:22px; height:22px; border-radius:50%; background:rgba(0,0,0,0.5); color:white; display:flex; align-items:center; justify-content:center; font-size:11px; z-index:52; cursor:pointer}
.mobile-cam-toggle { display:none}
.more-menu { position:absolute; bottom:70px; right:16px; background:#1c1c1e; border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:6px; z-index:110; display:flex; flex-direction:column; width:200px; box-shadow:0 10px 30px rgba(0,0,0,0.5); opacity:0; transform:translateY(8px) scale(0.94); transform-origin:bottom right; pointer-events:none; transition:opacity .18s ease, transform .22s cubic-bezier(.34,1.56,.64,1)}
.more-menu.open { opacity:1; transform:translateY(0) scale(1); pointer-events:auto}
.more-menu-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:8px; cursor:pointer; color:#e5e5e5; font-size:13px; white-space:nowrap}
.more-menu-item:hover { background:rgba(255,255,255,0.08)}
.more-menu-item i { width:16px; text-align:center; color:rgba(255,255,255,0.7); flex:none}
.more-menu-item span { flex:1}
.more-menu-dot { width:7px; height:7px; border-radius:50%; background:#ef4444; margin-left:auto; flex:none}
.mobile-only-menu-item { display:none}
/* ============================================================
   Any narrower viewport (tablet AND mobile alike, both inside the
   app and in a resized desktop browser tab) collapses the
   less-critical tools (hand-raise, reactions, fullscreen, PiP,
   focus mode, captions, record) into a "More" dropdown instead of
   hiding them outright or overflowing the bar. Only a genuinely
   wide desktop view (>900px) keeps everything spread out inline.
   NOTE: this block is placed near the END of the stylesheet
   deliberately - CSS resolves equal-specificity conflicts by
   picking whichever rule comes LAST in source order, regardless
   of media-query nesting. An earlier version of this block sat
   above the unconditional .more-btn/.overflow-sep base rules,
   which silently cancelled it out at every screen width.
   ============================================================ */
.local-wrap.locked .lock-toggle { color:#fbbf24}
#localVideo { width:210px; aspect-ratio:16/11; border-radius:16px; border:2px solid rgba(255,255,255,0.14); background:#16161a; object-fit:cover; display:block; transform:scaleX(-1)}
.local-avatar { position:absolute; inset:0; width:210px; aspect-ratio:16/11; border-radius:16px; z-index:51; display:none; align-items:center; justify-content:center}
.local-avatar.show { display:flex}
.video-label, .remote-label { position:absolute; background:rgba(10,10,12,0.6); padding:5px 12px; border-radius:20px; font-size:12px; z-index:60; display:flex; align-items:center; gap:6px}
.video-label { bottom:8px; left:8px; z-index:61}
.remote-label { top:18px; left:18px}
.mic-dot { width:7px; height:7px; border-radius:50%; background:#22c55e}
.mic-dot.muted { background:#ef4444}
.status-bar { position:absolute; top:18px; left:50%; transform:translateX(-50%); z-index:90; display:${showStatusBar ? 'flex' :'none'}; align-items:center; gap:14px; background:rgba(15,15,18,0.6); padding:8px 18px; border-radius:999px; font-size:12.5px}
.status-bar .conn-dot { width:8px; height:8px; border-radius:50%; background:#f59e0b}
.status-bar .conn-dot.good { background:#22c55e; box-shadow:0 0 8px #22c55e88}
.status-bar .conn-dot.bad { background:#ef4444}
.conn-pill { display:flex; align-items:center; gap:7px; cursor:pointer}
.rec-ind { display:none; align-items:center; gap:6px; color:#fca5a5}
.rec-blob { width:8px; height:8px; border-radius:50%; background:#ef4444; animation:recPulse 1.4s ease-in-out infinite}
@keyframes recPulse { 0%,100% { opacity:1; box-shadow:0 0 0 0 #ef444466} 50% { opacity:0.6; box-shadow:0 0 0 5px #ef444400} }
.conn-panel { position:absolute; top:58px; left:50%; transform:translateX(-50%); z-index:92; display:none; flex-direction:column; gap:8px; width:236px; background:rgba(18,18,22,0.95); padding:13px 15px; border-radius:12px; font-size:12.5px}
.conn-panel.open { display:flex}
.cp-row { display:flex; justify-content:space-between; gap:10px}
.cp-row span { color:rgba(255,255,255,0.6)}
.remote-label .ok { color:#22c55e}
.remote-label .off { color:#ef4444}
.tool-btn.slim { width:26px}
.bar-handle { position:absolute; bottom:20px; left:50%; z-index:100; display:flex; align-items:center; gap:8px; background:rgba(20,20,24,0.7); color:white; padding:8px 16px; border-radius:999px; cursor:pointer; font-size:12.5px; transform:translateX(-50%) translateY(150%); opacity:0; pointer-events:none; transition:transform .34s cubic-bezier(.22,.75,.3,1), opacity .24s ease}
.bar-handle.shown { transform:translateX(-50%); opacity:1; pointer-events:auto}
.bar-sep { width:1px; height:26px; background:rgba(255,255,255,0.16); margin:0 3px}
.wb-actions { display:flex; align-items:center; gap:8px}
.save-wb { background:#f3f4f6; color:#374151; padding:7px 14px; border-radius:8px; cursor:pointer; border:1px solid #e5e5e5; font-size:12.5px}
#lockWb { transition:background .25s ease, color .25s ease, border-color .25s ease}
#lockWb.active { background:#fef3c7; color:#92400e; border-color:#fde68a}
#lockWb i { display:inline-block; transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
#lockWb.lock-flip i { animation:lockFlip .32s ease}
@keyframes lockFlip { 0% { transform:scale(1) rotate(0)} 50% { transform:scale(1.35) rotate(-12deg)} 100% { transform:scale(1) rotate(0)} }
.toolbar-wrap { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); z-index:100; display:flex; align-items:center; gap:6px; padding:8px; border-radius:22px; transition:transform .34s cubic-bezier(.22,.75,.3,1), opacity .24s ease; ${barStyle === 'glass' ? 'background:rgba(20,20,24,0.55);' :'background:#1c1c20;'} }
.toolbar-wrap.tucked { transform:translateX(-50%) translateY(150%); opacity:0; pointer-events:none}
.tool-btn { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; cursor:pointer; background:rgba(255,255,255,0.05); transition:transform .12s cubic-bezier(.34,1.56,.64,1), background .15s ease}
.more-btn { display:none}
.overflow-sep { display:none}
.overflow-tools { display:flex; align-items:center; gap:6px}
/* App mode: driven by an explicit isAppMode flag (set via a URL parameter the
   mobile app passes when loading the page), NOT by viewport width - so a
   phone-sized BROWSER tab still gets the normal responsive tablet/mobile
   behavior further below, while the app itself always shows only mic,
   camera, whiteboard and leave, at any width. !important is used deliberately
   throughout so this can never be silently overridden by cascade/source-order
   issues elsewhere in this stylesheet. */
.app-mode #chat-btn,
.app-mode #hand-btn,
.app-mode #reaction-btn,
.app-mode #fs-btn,
.app-mode #pip-btn,
.app-mode #focus-btn,
.app-mode #cc-btn,
.app-mode #rec-btn,
.app-mode #share-btn,
.app-mode .more-btn,
.app-mode .overflow-tools,
.app-mode .overflow-sep,
.app-mode .bar-sep { display:none !important}
.app-mode.toolbar-wrap { gap:10px !important}
.app-mode .tool-btn { width:50px !important; height:50px !important; font-size:19px !important}
.app-mode .device-caret { width:22px !important; height:50px !important; font-size:11px !important}
.app-mode .end-btn { height:50px !important; padding:0 18px !important; font-size:15px !important}
.captions-bar { position:absolute; bottom:96px; left:50%; transform:translateX(-50%); z-index:97; max-width:80%; background:rgba(0,0,0,0.72); color:white; padding:10px 18px; border-radius:12px; font-size:15px; line-height:1.4; text-align:center; display:none}
.captions-bar.show { display:block}
.captions-bar .cc-speaker { font-size:11px; font-weight:700; color:#fbbf24; display:block; margin-bottom:2px}
.tool-btn:hover { background:rgba(255,255,255,0.12)}
.tool-btn:active { transform:scale(0.86)}
.end-btn:active { transform:scale(0.96)}
.device-caret:active { transform:scale(0.85)}
#mic-btn, #video-btn { border-radius:14px 0 0 14px}
.tool-btn.danger-active { background:#ef4444}
.tool-btn.success-active { background:#22c55e}
.tool-btn.accent-active { background:var(--accent); box-shadow:0 0 12px var(--accent-glow)}
.tool-btn.success-active { box-shadow:0 0 12px #22c55e88}
.tool-btn.danger-active { box-shadow:0 0 12px #ef444488}
.end-btn { display:flex; align-items:center; gap:8px; background:linear-gradient(135deg,#ef4444,#b91c1c); color:white; padding:0 20px; height:46px; border-radius:14px; border:none; cursor:pointer; transition:transform .12s cubic-bezier(.34,1.56,.64,1)}
.reaction-picker { position:absolute; bottom:80px; display:none; gap:6px; background:rgba(20,20,24,0.85); padding:8px; border-radius:16px}
.reaction-picker.open { display:flex}
.reaction-float { position:absolute; font-size:34px; z-index:300; pointer-events:none; animation:floatUp 2.2s ease-out forwards}
@keyframes floatUp { 0% { opacity:0} 15% { opacity:1} 100% { opacity:0; transform:translateY(-220px)} }
.hand-banner { position:absolute; top:70px; left:50%; transform:translateX(-50%); background:#f59e0b; color:#1a1a1a; padding:8px 18px; border-radius:999px; z-index:95; opacity:0}
.hand-banner.show { opacity:1}
.time-left-chip { background:rgba(245,158,11,0.18); color:#fbbf24; padding:3px 10px; border-radius:999px; font-size:11.5px}
.reconnect-btn { width:24px; height:24px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#e5e5e5}
.late-join-banner { position:absolute; top:64px; left:50%; transform:translateX(-50%); z-index:96; background:rgba(24,24,28,0.96); color:white; padding:16px 18px; border-radius:16px; font-size:13px; display:flex; flex-direction:column; gap:12px; width:min(88vw, 320px); box-shadow:0 8px 24px rgba(0,0,0,0.35)}
.late-join-banner-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px}
.late-join-banner #lateJoinText { line-height:1.5; color:rgba(255,255,255,0.9)}
.late-join-banner button { background:var(--accent); color:white; border:none; padding:11px; border-radius:10px; cursor:pointer; font-size:13px; font-weight:600; width:100%}
.late-join-banner .ljb-dismiss { background:transparent; color:#9ca3af; padding:0; font-size:18px; width:auto; line-height:1; flex:none}
.focus-mode .status-bar, .focus-mode .reaction-picker, .focus-mode #chat-btn, .focus-mode #hand-btn, .focus-mode #reaction-btn { display:none !important}
.camera-off-nudge { position:absolute; bottom:100px; right:20px; background:rgba(30,30,34,0.92); color:#fbbf24; padding:8px 14px; border-radius:10px; font-size:12px; z-index:96}
.role-badge { font-size:9.5px; padding:1px 6px; border-radius:5px; margin-left:5px; background:rgba(255,255,255,0.14); color:#e5e5e5; vertical-align:1px}
.typing-ind { font-size:11.5px; color:#9ca3af; padding:0 14px 6px; font-style:italic}
.drawing-ind { position:absolute; top:8px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.6); color:#e5e5e5; font-size:11px; padding:3px 10px; border-radius:999px; z-index:50; opacity:0; transition:opacity .25s}
.drawing-ind.show { opacity:1}
.device-picker { position:absolute; bottom:64px; background:#1e1e1e; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:6px 6px 12px; z-index:110; display:none; min-width:170px; box-shadow:0 8px 24px rgba(0,0,0,0.4)}
.device-picker::after { content:''; position:absolute; bottom:-6px; left:16px; width:12px; height:12px; background:#1e1e1e; border-right:1px solid rgba(255,255,255,0.1); border-bottom:1px solid rgba(255,255,255,0.1); transform:rotate(45deg)}
.device-picker.open { display:block}
.device-picker div { padding:7px 10px; font-size:12.5px; color:#e5e5e5; border-radius:6px; cursor:pointer}
.device-picker div.active { background:rgba(59,130,246,0.15); color:white}
.device-picker div.active i.fa-check { color:var(--accent); margin-right:4px; font-size:11px}
.device-picker div:hover { background:rgba(255,255,255,0.08)}
.device-group { display:flex; align-items:center; position:relative}
.device-caret { width:20px; height:46px; border-radius:0 12px 12px 0; margin-left:1px; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.55); cursor:pointer; background:rgba(255,255,255,0.04); font-size:9px; transition:background .15s ease, color .15s ease, transform .12s cubic-bezier(.34,1.56,.64,1)}
.device-caret:hover { background:rgba(255,255,255,0.12); color:white}
.device-mic-meter-row { display:flex; align-items:center; gap:8px; padding:8px 4px 4px; border-top:1px solid rgba(255,255,255,0.08); margin-top:4px}
.device-mic-meter-row i.fa-microphone { color:#8a8a8a; font-size:12px; flex:none}
.device-mic-meter { flex:1; height:9px; border-radius:5px; background:rgba(255,255,255,0.12); overflow:hidden; position:relative}
.device-mic-meter-bar { position:absolute; top:0; left:0; bottom:0; width:0%; background:#22c55e; transition:width .1s ease-out}
.whiteboard-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(6,6,8,0.9); z-index:200; display:none; justify-content:center; align-items:center}
.whiteboard-container { width:92%; height:92%; background:#ffffff; border:1px solid #e5e5e5; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 8px 30px rgba(0,0,0,0.25)}
.wb-header { background:#ffffff; border-bottom:1px solid #ececec; padding:11px 20px; display:flex; align-items:center; gap:12px; color:#111827}
.wb-header .wb-actions { margin-left:auto}
.wb-saved-hint { font-size:11.5px; color:#9ca3af}
.wb-body { flex:1; display:flex; flex-direction:column; min-height:0}
.wb-main-row { flex:1; display:flex; min-height:0; position:relative}
.wb-video-box { position:absolute; bottom:14px; right:14px; z-index:30; display:flex; gap:6px; cursor:grab}
.wb-video-box.vertical { flex-direction:column}
#shareVideoBox { z-index:80}
.orient-toggle { position:absolute; top:-8px; left:-8px; width:20px; height:20px; border-radius:50%; background:rgba(0,0,0,0.6); color:white; display:flex; align-items:center; justify-content:center; font-size:9px; z-index:32; cursor:pointer}
.wb-video-box.dragging { cursor:grabbing}
.wb-video-box .lock-toggle { position:absolute; top:-8px; right:-8px; width:20px; height:20px; border-radius:50%; background:rgba(0,0,0,0.6); color:white; display:flex; align-items:center; justify-content:center; font-size:10px; z-index:32; cursor:pointer}
.wb-video-box.locked .lock-toggle { color:#fbbf24}
.wb-peer-video, .wb-local-video { width:170px; height:122px; border-radius:8px; background:#0d1a33; object-fit:cover; border:2px solid var(--accent)}
.wb-local-video { border-color:rgba(255,255,255,0.4); transform:scaleX(-1)}
.remote-cursor-dot { position:absolute; width:11px; height:11px; border-radius:50%; background:#d4537e; box-shadow:0 0 0 3px rgba(212,83,126,0.22); pointer-events:none; z-index:38; display:none; transform:translate(-50%,-50%)}
.remote-cursor-dot .rc-tag { position:absolute; top:-18px; left:8px; font-size:10px; white-space:nowrap; background:#FBEAF0; color:#993556; padding:1px 6px; border-radius:4px}
.wb-hidden-input { display:none}
.close-wb { background:#fef2f2; color:#dc2626; padding:7px 16px; border-radius:8px; cursor:pointer; border:1px solid #fecaca; font-size:12.5px; display:inline-flex; align-items:center; gap:6px; transition:transform .15s ease, box-shadow .3s ease}
.close-wb-glow { animation:closeWbPulse 2.4s ease-in-out infinite}
.close-wb-glow:hover { transform:scale(1.05); box-shadow:0 0 14px rgba(220,38,38,0.45)}
@keyframes closeWbPulse { 0%,100% { box-shadow:0 0 0 0 rgba(220,38,38,0.25)} 50% { box-shadow:0 0 10px 2px rgba(220,38,38,0.28)} }
.canvas-area { flex:1; background:#fafafa; background-image:linear-gradient(#ececec 1px,transparent 1px),linear-gradient(90deg,#ececec 1px,transparent 1px); background-size:28px 28px; position:relative; overflow:hidden}
.viewport.pip-mode { position:fixed; width:230px; height:145px; left:auto; top:auto; right:24px; bottom:24px; border-radius:16px; z-index:260; border:2px solid var(--accent)}
.viewport.pip-mode .toolbar-wrap, .viewport.pip-mode .status-bar, .viewport.pip-mode .reaction-picker { display:none !important}
.viewport.pip-mode .local-wrap { top:auto !important; left:auto !important; bottom:8px; right:8px; width:78px}
.pip-close { position:absolute; top:6px; right:6px; width:22px; height:22px; border-radius:50%; background:rgba(0,0,0,0.55); color:white; display:none; align-items:center; justify-content:center; z-index:270; cursor:pointer}
.viewport.pip-mode .pip-close { display:flex}
.chat-panel { position:fixed; top:0; right:-320px; width:300px; height:100%; background:rgba(18,18,22,0.92); z-index:150; display:flex; flex-direction:column; transition:right 0.28s}
.chat-panel.open { right:0}
.chat-header { padding:16px; font-size:14px; font-weight:600; display:flex; justify-content:space-between; align-items:center}
.close-chat { background:none; border:none; color:white; cursor:pointer}
.chat-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px}
.chat-msg { max-width:85%; padding:9px 13px; border-radius:12px; font-size:13px}
.chat-msg.mine { align-self:flex-end; background:var(--accent); color:white}
.chat-msg.theirs { align-self:flex-start; background:rgba(255,255,255,0.08); color:white}
.chat-input-row { display:flex; padding:12px; gap:8px}
.chat-input-row input { flex:1; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 12px; color:white}
.chat-input-row button { background:var(--accent); border:none; color:white; border-radius:10px; padding:0 16px; cursor:pointer}
.ToolIcon__library, [aria-label="Library"], [data-testid="library-button"] { display:none !important}

/* ============================================================
   MOBILE-ONLY OVERRIDES — everything below this comment only
   applies when the viewport is narrow (e.g. inside the mobile
   app's WebView). Nothing above this line is touched, so the
   desktop/web experience is completely unaffected.
   ============================================================ */
@media (max-width: 900px) {
.overflow-tools { display:none}
.overflow-sep { display:block}
.more-btn { display:flex}
}
@media (max-width: 480px) {
#chat-btn { display:none !important}
#share-btn { display:none !important}
.mobile-only-menu-item { display:flex}
.prejoin-card { flex-direction:column; padding:24px 20px; gap:20px; overflow-y:auto}
.prejoin-video-wrap { flex:none; width:100%; aspect-ratio:4/3}
.status-bar {
flex-direction:row;
align-items:center;
gap:8px;
border-radius:14px;
padding:7px 12px;
font-size:10.5px;
top:14px;
max-width:calc(100vw - 24px);
}
.status-bar .title { display:none}
.status-bar .rec-ind { display:none}
.status-bar .time-left-chip { font-size:9px; padding:2px 6px}
.remote-label {
top:14px;
left:10px;
font-size:10.5px;
padding:4px 9px;
gap:4px;
max-width:calc(100vw - 24px);
}
.remote-label .role-badge { display:none}
.remote-label #remoteLabel { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:150px}
.video-label { font-size:10.5px; padding:4px 9px}
.video-label .role-badge { display:none}
.local-wrap { top:14px; left:auto; right:12px; bottom:auto; width:122px; z-index:70; border-radius:18px; box-shadow:0 6px 18px rgba(0,0,0,0.35); }
#localVideo, .local-avatar { width:122px; border-radius:18px; border-width:1.5px; border-color:rgba(255,255,255,0.22)}
.local-wrap .video-label { display:none}
.local-wrap .lock-toggle { display:none}
.mobile-cam-toggle { display:flex !important; position:absolute; top:6px; left:6px; width:20px; height:20px; border-radius:50%; background:rgba(0,0,0,0.55); color:white; align-items:center; justify-content:center; font-size:10px; z-index:71; cursor:pointer}
.local-wrap.mobile-hidden #localVideo,
.local-wrap.mobile-hidden .local-avatar,
.local-wrap.mobile-hidden .video-label { display:none !important}
.local-wrap.mobile-hidden { width:32px; height:32px; background:rgba(0,0,0,0.5); border-radius:16px}
.toolbar-wrap { gap:6px; padding:6px 10px; bottom:22px; max-width:calc(100vw - 20px); flex-wrap:nowrap; justify-content:center}
.tool-btn { width:34px; height:34px; border-radius:9px; font-size:13px; flex:none}
.device-caret { height:34px; width:16px; flex:none}
.end-btn { height:34px; padding:0 11px; font-size:12px; flex:none; white-space:nowrap}
.bar-sep { height:18px; flex:none}
.more-btn { width:34px; height:34px}
.more-menu { width:180px; right:8px; bottom:66px}
.more-menu-item { padding:8px 9px; font-size:12.5px}
.whiteboard-container { width:98%; height:96%}
.wb-header { padding:8px 12px; flex-wrap:wrap}
.wb-peer-video, .wb-local-video { width:90px; height:64px}
.chat-panel { width:86vw; right:-86vw}
}
    </style>
</head>
<body>
<div class="prejoin-screen" id="prejoinScreen">
    <div class="prejoin-card">
        <div class="prejoin-video-wrap">
            <video id="prejoinVideo" autoplay muted playsinline></video>
            <div class="prejoin-video-controls">
                <div class="prejoin-mini-btn" id="prejoinMicToggle" onclick="togglePrejoinMic()" title="Mute mic"><i class="fas fa-microphone"></i></div>
                <div class="prejoin-mini-btn" id="prejoinCamToggle" onclick="togglePrejoinCam()" title="Turn off camera"><i class="fas fa-video"></i></div>
            </div>
        </div>
        <div class="prejoin-controls-col">
            <div class="prejoin-heading">
                <h3>Check your camera and mic</h3>
                <p class="prejoin-sub" id="prejoinLessonSub"></p>
            </div>
            <div class="prejoin-row">
                <i class="fas fa-microphone" style="color:#9ca3af;font-size:13px;"></i>
                <div class="prejoin-mic-track"><div class="prejoin-mic-bar" id="prejoinMicBar"></div></div>
            </div>
            <div class="prejoin-row prejoin-dd-wrap">
                <i class="fas fa-video" style="color:#9ca3af;font-size:13px;width:16px;"></i>
                <div class="prejoin-dd" id="prejoinCamDd" onclick="togglePrejoinDd('cam')">
                    <span id="prejoinCamLabel">Camera</span><i class="fas fa-chevron-down"></i>
                    <div class="prejoin-dd-list" id="prejoinCamList"></div>
                </div>
            </div>
            <div class="prejoin-row prejoin-dd-wrap">
                <i class="fas fa-microphone" style="color:#9ca3af;font-size:13px;width:16px;"></i>
                <div class="prejoin-dd" id="prejoinMicDd" onclick="togglePrejoinDd('mic')">
                    <span id="prejoinMicLabel">Microphone</span><i class="fas fa-chevron-down"></i>
                    <div class="prejoin-dd-list" id="prejoinMicList"></div>
                </div>
            </div>
            <p class="prejoin-hint" id="prejoinHint">Speak normally — the bar above should move.</p>
            <button class="prejoin-join-btn" id="prejoinJoinBtn" onclick="actuallyJoinCall()" disabled>Join lesson</button>
        </div>
    </div>
</div>
<div class="leave-confirm-modal" id="leaveConfirmModal">
    <div class="leave-confirm-card">
        <p class="leave-confirm-title">Leave this lesson?</p>
        <p class="leave-confirm-sub">You can rejoin later if the lesson is still active.</p>
        <div class="leave-confirm-actions">
            <button class="leave-cancel-btn" onclick="cancelEndCall()">Stay</button>
            <button class="leave-confirm-btn" onclick="reallyEndCall()">Leave</button>
        </div>
    </div>
</div>
<div class="viewport" id="viewport">
    <video id="remoteVideo" autoplay playsinline></video>
    <div class="avatar-circle show" id="remoteAvatar">
        ${remotePhotoUrl ? `<img src="${remotePhotoUrl}" class="circle-photo" alt="">` : `<div class="circle">${initialsRemote}</div>`}
        <p class="waiting-title" id="waitingTitle">Waiting for ${remoteName} to join</p>
    </div>
    <div class="remote-label" id="remoteLabelWrap" style="display:none;"><span id="remoteLabel">${remoteName}</span><span class="role-badge">${isTeacher ? 'Student' : 'Teacher'}</span><i id="peerMic" class="fas fa-microphone ok"></i><i id="peerCam" class="fas fa-video ok"></i></div>
    <div class="hand-banner" id="handBanner"></div>
    <div class="pip-close" id="pipClose" onclick="closeWhiteboard()"><i class="fas fa-expand"></i></div>

    <div class="local-wrap" id="localWrap">
        <div class="lock-toggle" id="localLockToggle" onclick="toggleLocalLock(event)" title="Lock/unlock position"><i class="fas fa-lock-open"></i></div>
        <div class="mobile-cam-toggle" id="mobileCamToggle" onclick="toggleMobileLocalVideo(event)" title="Hide/show your camera preview"><i class="fas fa-eye"></i></div>
        <video id="localVideo" autoplay muted playsinline></video>
        <div class="local-avatar" id="localAvatar"><div class="circle-sm">${initialsLocal}</div></div>
        <div class="video-label"><span class="mic-dot" id="micDot"></span> ${userName}<span class="role-badge">${isTeacher ? 'Teacher' : 'Student'}</span></div>
    </div>

    <div class="wb-video-box" id="shareVideoBox" style="display:none;">
        <div class="lock-toggle" id="shareVideoLockToggle" onclick="toggleShareVideoLock(event)" title="Lock/unlock position"><i class="fas fa-lock-open"></i></div>
        <div class="orient-toggle" id="shareVideoOrientToggle" onclick="toggleShareVideoOrientation(event)" title="Switch layout"><i class="fas fa-arrows-left-right"></i></div>
        <video id="sharePeerVideo" class="wb-peer-video" autoplay playsinline muted></video>
        <video id="shareLocalVideo" class="wb-local-video" autoplay muted playsinline></video>
    </div>

    <div class="status-bar" id="statusBar">
        <span class="conn-pill" onclick="toggleConnPanel()"><span class="conn-dot" id="connDot"></span>Connection<i class="fas fa-volume-up" id="audioQualityIcon" style="margin-left:4px;font-size:11px;color:#22c55e" title="Audio quality"></i></span>
        <span class="title">${lessonTitle || 'Live Lesson'}</span>
        <span class="timer" id="callTimer">00:00</span>
        <span class="time-left-chip" id="timeLeftChip" style="display:none;">5 min left</span>
        <span class="rec-ind" id="recDot"><span class="rec-blob"></span>Recording locally</span>
        <span class="reconnect-btn" id="reconnectBtn" onclick="manualReconnect()" style="display:none;" title="Force reconnect"><i class="fas fa-rotate"></i></span>
    </div>
    <div class="captions-bar" id="captionsBar"></div>
    <div class="late-join-banner" id="lateJoinBanner" style="display:none;">
        <div class="late-join-banner-top">
            <span id="lateJoinText"></span>
            <button class="ljb-dismiss" onclick="dismissLateJoinBanner()">&times;</button>
        </div>
        <button onclick="sendLateJoinReminder()">Send reminder</button>
    </div>
    <div class="conn-panel" id="connPanel">
        <div class="cp-row"><span>Your connection</span><b id="cpMine">checking</b></div>
        <div class="cp-row"><span>${remoteName}</span><b id="cpTheirs">waiting</b></div>
        <div class="cp-row"><span>Whiteboard channel</span><b id="cpData">connecting</b></div>
    </div>

    <div class="reaction-picker" id="reactionPicker">
        <button data-e="👍">👍</button>
        <button data-e="❤️">❤️</button>
        <button data-e="😂">😂</button>
        <button data-e="👏">👏</button>
        <button data-e="🎉">🎉</button>
        <button data-e="🤔">🤔</button>
    </div>

    <div class="toolbar-wrap ${isAppMode ? 'app-mode' : ''}">
        <div class="device-group"><div class="tool-btn" onclick="toggleMic()" id="mic-btn" title="Mute"><i class="fas fa-microphone"></i></div><div class="device-caret" onclick="toggleDevicePicker(event,'audio')" title="Choose microphone"><i class="fas fa-chevron-up"></i></div></div>
        <div class="device-group"><div class="tool-btn" onclick="toggleVideo()" id="video-btn" title="Camera"><i class="fas fa-video"></i></div><div class="device-caret" onclick="toggleDevicePicker(event,'video')" title="Choose camera"><i class="fas fa-chevron-up"></i></div></div>
        <div class="device-picker" id="devicePicker"></div>
        <span class="bar-sep"></span>
        ${enableScreenShare ? '<div class="tool-btn" onclick="toggleScreenShare()" id="share-btn" title="Share Screen"><i class="fas fa-arrow-up-from-bracket"></i></div>' : ''}
        ${enableWhiteboard ? '<div class="tool-btn" onclick="openWhiteboard()" id="wb-btn" title="Whiteboard"><i class="fas fa-square-pen"></i></div>' : ''}
        ${enableChat ? '<div class="tool-btn" onclick="toggleChatPanel()" title="Chat" id="chat-btn"><i class="fas fa-comment"></i><span class="badge" id="chatBadge" style="display:none;">0</span></div>' : ''}
        <span class="bar-sep overflow-sep" id="overflowSep"></span>
        <div class="overflow-tools" id="overflowTools">
        ${enableRaiseHand ? '<div class="tool-btn" onclick="toggleRaiseHand()" id="hand-btn" title="Raise Hand"><i class="fas fa-hand"></i></div>' : ''}
        ${enableReactions ? '<div class="tool-btn" onclick="toggleReactionPicker()" id="reaction-btn" title="Reactions"><i class="fas fa-face-smile"></i></div>' : ''}
        ${enableFullscreen ? '<div class="tool-btn" onclick="toggleFullscreen()" id="fs-btn" title="Fullscreen"><i class="fas fa-expand"></i></div>' : ''}
        ${enablePipButton ? '<div class="tool-btn" onclick="toggleNativePip()" id="pip-btn" title="Picture in Picture"><i class="fas fa-clone"></i></div>' : ''}
        <div class="tool-btn" onclick="toggleFocusMode()" id="focus-btn" title="Focus mode"><i class="fas fa-compress"></i></div>
        <div class="tool-btn" onclick="toggleCaptions()" id="cc-btn" title="Live captions"><i class="fas fa-closed-captioning"></i></div>
        <div class="tool-btn" onclick="toggleRecording()" id="rec-btn" title="Record on my device"><i class="fas fa-circle"></i></div>
        </div>
        <div class="tool-btn more-btn" id="more-btn" onclick="toggleMoreMenu(event)" title="More tools"><i class="fas fa-ellipsis-vertical"></i></div>
        <div class="more-menu" id="moreMenu">
        ${enableScreenShare ? '<div class="more-menu-item mobile-only-menu-item" onclick="toggleScreenShare(); closeMoreMenu();"><i class="fas fa-arrow-up-from-bracket"></i><span>Share Screen</span></div>' : ''}
        ${enableChat ? '<div class="more-menu-item mobile-only-menu-item" onclick="toggleChatPanel(); closeMoreMenu();"><i class="fas fa-comment"></i><span>Chat</span><span class="more-menu-dot" id="chatBadgeMenu" style="display:none;"></span></div>' : ''}
        ${enableRaiseHand ? '<div class="more-menu-item" onclick="toggleRaiseHand(); closeMoreMenu();"><i class="fas fa-hand"></i><span>Raise Hand</span></div>' : ''}
        ${enableReactions ? '<div class="more-menu-item" onclick="toggleReactionPicker(); closeMoreMenu();"><i class="fas fa-face-smile"></i><span>Reactions</span></div>' : ''}
        ${enableFullscreen ? '<div class="more-menu-item" onclick="toggleFullscreen(); closeMoreMenu();"><i class="fas fa-expand"></i><span>Fullscreen</span></div>' : ''}
        ${enablePipButton ? '<div class="more-menu-item" onclick="toggleNativePip(); closeMoreMenu();"><i class="fas fa-clone"></i><span>Picture in Picture</span></div>' : ''}
        <div class="more-menu-item" onclick="toggleFocusMode(); closeMoreMenu();"><i class="fas fa-compress"></i><span>Focus mode</span></div>
        <div class="more-menu-item" onclick="toggleCaptions(); closeMoreMenu();"><i class="fas fa-closed-captioning"></i><span>Live captions</span></div>
        <div class="more-menu-item" onclick="toggleRecording(); closeMoreMenu();"><i class="fas fa-circle"></i><span>Record</span></div>
        </div>
        <span class="bar-sep"></span>
        <button class="end-btn" onclick="endCall()"><i class="fas fa-phone-slash"></i> Leave</button>
        <div class="tool-btn slim" onclick="hideBar()" title="Hide controls"><i class="fas fa-chevron-down"></i></div>
    </div>
    <div class="bar-handle" id="barHandle" onclick="showBar()"><i class="fas fa-chevron-up"></i> Show controls</div>
</div>

<div id="whiteboardModal" class="whiteboard-modal">
    <div class="whiteboard-container">
        <div class="wb-header">
            <span>Whiteboard</span>
            <span class="wb-saved-hint" id="wbSavedHint"></span>
            <span class="wb-actions">
                ${isTeacher ? '<button class="save-wb" id="lockWb" onclick="toggleWbLockForStudent()" title="Lock drawing for student"><i class="fas fa-lock-open"></i></button>' : ''}
                <button class="close-wb close-wb-glow" onclick="closeWhiteboard()"><i class="fas fa-xmark"></i> Close</button>
            </span>
        </div>
        <div class="wb-body">
            <div class="canvas-area" id="canvasArea">
                <div id="excalidrawRoot" style="width:100%;height:100%;position:relative;"></div>
                <div id="wbLockOverlay" style="position:absolute;inset:0;z-index:15;display:none;cursor:not-allowed;"></div>
                <div class="remote-cursor-dot" id="remoteCursorDot"><span class="rc-tag" id="rcTag"></span></div>
                <div class="wb-video-box" id="wbVideoBox">
<div class="lock-toggle" id="wbVideoLockToggle" onclick="toggleWbVideoLock(event)" title="Lock/unlock position"><i class="fas fa-lock-open"></i></div>
<video id="wbPeerVideo" class="wb-peer-video" autoplay playsinline muted></video>
<video id="wbLocalVideo" class="wb-local-video" autoplay muted playsinline></video>
</div>
            </div>
        </div>
    </div>
</div>
<script type="module">
import React from "react";
import { createRoot } from "react-dom/client";
import { Excalidraw } from "https://esm.sh/@excalidraw/excalidraw@0.18.0?external=react,react-dom";
window.__excalidrawReact = React;
window.__excalidrawRoot = null;
window.__excalidrawAPI = null;
window.mountExcalidraw = function() {
if (window.__excalidrawRoot) return;
const container = document.getElementById('excalidrawRoot');
window.__excalidrawRoot = createRoot(container);
window.__excalidrawRoot.render(
React.createElement(Excalidraw, {
excalidrawAPI: (api) => { window.__excalidrawAPI = api; if (window.onExcalidrawReady) window.onExcalidrawReady(); },
onChange: (elements, appState, files) => { if (window.onExcalidrawChange) window.onExcalidrawChange(elements, appState, files); },
theme: "light",
})
);
};
<\/script>

<div id="chatPanel" class="chat-panel">
    <div class="chat-header">
        <span>Chat</span>
        <span style="margin-left:auto;display:flex;align-items:center;gap:10px;">
            <i class="fas fa-trash" onclick="clearChatHistory()" title="Clear chat" style="cursor:pointer;color:#9ca3af;font-size:13px;"></i>
            <button class="close-chat" onclick="toggleChatPanel()">x</button>
        </span>
    </div>
    <div class="chat-messages" id="chatMessages"></div>
    <div class="typing-ind" id="typingInd" style="display:none;"></div>
    <div class="chat-input-row">
        <input type="text" id="chatInput" placeholder="Type a message..." oninput="notifyTyping()" onkeydown="if(event.key==='Enter'){sendChatFromInput();}">
        <button onclick="sendChatFromInput()">Send</button>
    </div>
</div>

<script>
const LESSON_ID = "${lessonId}";
const IS_TEACHER = ${isTeacher};
const USER_NAME = "${userName}";
const REMOTE_NAME = "${remoteName}";
const PIP_ENABLED = ${enablePip};
const LESSON_END_ISO = "${lessonEndIso}";
const enableWhiteboardFlag = ${enableWhiteboard};
function notifyParent(type, payload) {
try { window.parent.postMessage({ type, payload }, '*'); } catch (e) { /* noop */ }
}
function throttle(fn, ms) {
let last = 0, pending = null;
return function (...args) {
const now = Date.now();
if (now - last >= ms) { last = now; fn.apply(this, args); }
else { clearTimeout(pending); pending = setTimeout(() => { last = Date.now(); fn.apply(this, args); }, ms - (now - last)); }
};
}
const peer = new Peer("${myId}", { config: { iceServers: ${iceServersJson} } });
let localStream, currentCall, screenStream;
let remoteStream = null;
let peerIsSharing = false;
let callStartedFired = false;
let timerInterval = null;
let callSeconds = 0;
let reconnectAttempts = 0;
let callRetryTimer = null;
function startTimer() {
if (timerInterval) return;
timerInterval = setInterval(() => {
callSeconds++;
const m = String(Math.floor(callSeconds / 60)).padStart(2, '0');
const s = String(callSeconds % 60).padStart(2, '0');
const el = document.getElementById('callTimer');
if (el) el.innerText = m + ':' + s;
}, 1000);
}
const QUALITY_TEXT = { good: 'Good', bad: 'Weak', unknown: 'Connecting' };
function setConnDot(state) {
const dot = document.getElementById('connDot');
if (dot) {
dot.classList.remove('good', 'bad');
if (state === 'good') dot.classList.add('good');
else if (state === 'bad') dot.classList.add('bad');
}
const mine = document.getElementById('cpMine');
if (mine) mine.innerText = QUALITY_TEXT[state] || 'Connecting';
const reconnectBtn = document.getElementById('reconnectBtn');
if (reconnectBtn) reconnectBtn.style.display = (state === 'bad') ? 'flex' : 'none';
sendState({ quality: state });
if (state === 'bad' && callStartedFired) flash('Connection is weak — trying to recover');
}
function toggleConnPanel() {
const p = document.getElementById('connPanel');
if (p) p.classList.toggle('open');
}
function setDataStatus(text) {
const el = document.getElementById('cpData');
if (el) el.innerText = text;
}
function hideBar() {
const b = document.querySelector('.toolbar-wrap'), h = document.getElementById('barHandle');
if (b) b.classList.add('tucked');
if (h) h.classList.add('shown');
}
function showBar() {
const b = document.querySelector('.toolbar-wrap'), h = document.getElementById('barHandle');
if (b) b.classList.remove('tucked');
if (h) h.classList.remove('shown');
}
function watchConnectionQuality(call) {
if (!call || !call.peerConnection) return;
call.peerConnection.oniceconnectionstatechange = () => {
const s = call.peerConnection.iceConnectionState;
if (s === 'connected' || s === 'completed') setConnDot('good');
else if (s === 'disconnected' || s === 'failed') setConnDot('bad');
};
}
peer.on('disconnected', () => {
setConnDot('bad');
if (!peer.destroyed) setTimeout(() => { try { peer.reconnect(); } catch (e) {} }, 1500);
});
peer.on('close', () => { setConnDot('bad'); });
peer.on('error', (err) => {
setConnDot('bad');
if (err && err.type === 'peer-unavailable') {
if ("${myId}".includes('student')) {
if (!callStartedFired) scheduleCallRetry();
if (!(dataConn && dataConn.open)) scheduleDataRetry();
}
} else if (err && ['network', 'server-error', 'socket-error', 'socket-closed'].includes(err.type)) {
setTimeout(() => { try { if (!peer.destroyed) peer.reconnect(); } catch (e) {} }, 2000);
}
});
function scheduleCallRetry() {
if (callStartedFired) return;
clearTimeout(callRetryTimer);
reconnectAttempts++;
const delay = Math.min(2000 + reconnectAttempts * 1000, 8000);
callRetryTimer = setTimeout(() => { if (!callStartedFired) connectToPeer(); }, delay);
}
let dataRetryTimer = null;
let dataConnectAttempts = 0;
function scheduleDataRetry() {
if (dataConn && dataConn.open) return;
clearTimeout(dataRetryTimer);
dataConnectAttempts++;
const delay = Math.min(2000 + dataConnectAttempts * 1000, 8000);
dataRetryTimer = setTimeout(() => { if (!(dataConn && dataConn.open)) connectDataChannel(); }, delay);
}
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
localStream = stream;
const prejoinVid = document.getElementById('prejoinVideo');
if (prejoinVid) prejoinVid.srcObject = stream;
initPrejoinMicMeter(stream);
populatePrejoinDevices();
document.getElementById('prejoinJoinBtn').disabled = false;
const prejoinSub = document.getElementById('prejoinLessonSub');
if (prejoinSub) prejoinSub.innerText = 'Lesson with ' + REMOTE_NAME;
}).catch(err => {
const hint = document.getElementById('prejoinHint');
if (hint) hint.innerText = 'Camera/microphone permission needed to join';
});
let prejoinAudioCtx = null, prejoinAnalyser = null, prejoinMeterRaf = null;
function initPrejoinMicMeter(stream) {
try {
prejoinAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = prejoinAudioCtx.createMediaStreamSource(stream);
prejoinAnalyser = prejoinAudioCtx.createAnalyser();
prejoinAnalyser.fftSize = 512;
source.connect(prejoinAnalyser);
const data = new Uint8Array(prejoinAnalyser.frequencyBinCount);
const bar = document.getElementById('prejoinMicBar');
const tick = () => {
prejoinAnalyser.getByteFrequencyData(data);
let sum = 0;
for (let i = 0; i < data.length; i++) sum += data[i];
const level = Math.min(100, Math.round((sum / data.length) * 1.8));
if (bar) bar.style.width = level + '%';
prejoinMeterRaf = requestAnimationFrame(tick);
};
tick();
} catch (e) {}
}
function stopPrejoinMicMeter() {
if (prejoinMeterRaf) cancelAnimationFrame(prejoinMeterRaf);
if (prejoinAudioCtx) { try { prejoinAudioCtx.close(); } catch (e) {} }
prejoinAudioCtx = null; prejoinAnalyser = null;
}
function truncateLabel(str, max) {
if (!str) return str;
return str.length > max ? str.slice(0, max) + '...' : str;
}
let prejoinDdOpen = null;
function togglePrejoinDd(which) {
const dd = document.getElementById(which === 'cam' ? 'prejoinCamDd' : 'prejoinMicDd');
const list = document.getElementById(which === 'cam' ? 'prejoinCamList' : 'prejoinMicList');
const isOpen = list.classList.contains('show');
document.querySelectorAll('.prejoin-dd-list').forEach(l => l.classList.remove('show'));
document.querySelectorAll('.prejoin-dd').forEach(d => d.classList.remove('open'));
if (!isOpen) { list.classList.add('show'); dd.classList.add('open'); }
}
document.addEventListener('click', (e) => {
if (!e.target.closest('.prejoin-dd-wrap')) {
document.querySelectorAll('.prejoin-dd-list').forEach(l => l.classList.remove('show'));
document.querySelectorAll('.prejoin-dd').forEach(d => d.classList.remove('open'));
}
});
async function populatePrejoinDevices() {
try {
const devices = await navigator.mediaDevices.enumerateDevices();
const cams = devices.filter(d => d.kind === 'videoinput');
const mics = devices.filter(d => d.kind === 'audioinput');
const camList = document.getElementById('prejoinCamList');
const micList = document.getElementById('prejoinMicList');
const camLabel = document.getElementById('prejoinCamLabel');
const micLabel = document.getElementById('prejoinMicLabel');
if (camList) {
camList.innerHTML = cams.map((d, i) => '<div data-id="' + d.deviceId + '" title="' + (d.label || '') + '" class="' + (i === 0 ? 'active' : '') + '">' + (i === 0 ? '<i class="fas fa-check"></i> ' : '') + truncateLabel(d.label || ('Camera ' + (i + 1)), 20) + '</div>').join('');
if (cams.length && camLabel) camLabel.innerText = truncateLabel(cams[0].label || 'Camera 1', 20);
camList.querySelectorAll('div').forEach((el, i) => {
el.onclick = (evt) => {
evt.stopPropagation();
camList.querySelectorAll('div').forEach(d => { d.classList.remove('active'); d.innerHTML = d.innerHTML.replace('<i class="fas fa-check"></i> ', ''); });
el.classList.add('active');
el.innerHTML = '<i class="fas fa-check"></i> ' + el.innerHTML;
if (camLabel) camLabel.innerText = truncateLabel(cams[i].label || 'Camera', 20);
switchPrejoinDevice('video', el.getAttribute('data-id'));
list_close();
};
});
}
if (micList) {
micList.innerHTML = mics.map((d, i) => '<div data-id="' + d.deviceId + '" title="' + (d.label || '') + '" class="' + (i === 0 ? 'active' : '') + '">' + (i === 0 ? '<i class="fas fa-check"></i> ' : '') + truncateLabel(d.label || ('Microphone ' + (i + 1)), 20) + '</div>').join('');
if (mics.length && micLabel) micLabel.innerText = truncateLabel(mics[0].label || 'Microphone 1', 20);
micList.querySelectorAll('div').forEach((el, i) => {
el.onclick = (evt) => {
evt.stopPropagation();
micList.querySelectorAll('div').forEach(d => { d.classList.remove('active'); d.innerHTML = d.innerHTML.replace('<i class="fas fa-check"></i> ', ''); });
el.classList.add('active');
el.innerHTML = '<i class="fas fa-check"></i> ' + el.innerHTML;
if (micLabel) micLabel.innerText = truncateLabel(mics[i].label || 'Microphone', 20);
switchPrejoinDevice('audio', el.getAttribute('data-id'));
list_close();
};
});
}
function list_close() {
document.querySelectorAll('.prejoin-dd-list').forEach(l => l.classList.remove('show'));
document.querySelectorAll('.prejoin-dd').forEach(d => d.classList.remove('open'));
}
} catch (e) {}
}
let prejoinMicOn = true, prejoinCamOn = true;
function togglePrejoinMic() {
prejoinMicOn = !prejoinMicOn;
if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = prejoinMicOn);
const btn = document.getElementById('prejoinMicToggle');
if (btn) { btn.classList.toggle('off', !prejoinMicOn); btn.querySelector('i').className = prejoinMicOn ? 'fas fa-microphone' : 'fas fa-microphone-slash'; }
}
function togglePrejoinCam() {
prejoinCamOn = !prejoinCamOn;
if (localStream) localStream.getVideoTracks().forEach(t => t.enabled = prejoinCamOn);
const btn = document.getElementById('prejoinCamToggle');
if (btn) { btn.classList.toggle('off', !prejoinCamOn); btn.querySelector('i').className = prejoinCamOn ? 'fas fa-video' : 'fas fa-video-slash'; }
}
async function switchPrejoinDevice(kind, deviceId) {
try {
const constraints = kind === 'audio' ? { audio: { deviceId: { exact: deviceId } }, video: false } : { video: { deviceId: { exact: deviceId } }, audio: false };
const newStream = await navigator.mediaDevices.getUserMedia(constraints);
const newTrack = kind === 'audio' ? newStream.getAudioTracks()[0] : newStream.getVideoTracks()[0];
newTrack.enabled = kind === 'audio' ? prejoinMicOn : prejoinCamOn;
const oldTracks = kind === 'audio' ? localStream.getAudioTracks() : localStream.getVideoTracks();
oldTracks.forEach(t => { localStream.removeTrack(t); t.stop(); });
localStream.addTrack(newTrack);
const prejoinVid = document.getElementById('prejoinVideo');
if (prejoinVid) prejoinVid.srcObject = localStream;
if (kind === 'audio' && prejoinMicOn) { stopPrejoinMicMeter(); initPrejoinMicMeter(localStream); }
} catch (e) { flash('Could not switch device'); }
}
function actuallyJoinCall() {
const overlay = document.getElementById('prejoinScreen');
if (overlay) overlay.style.display = 'none';
stopPrejoinMicMeter();
document.getElementById('localVideo').srcObject = localStream;
if (!prejoinMicOn) {
document.getElementById('mic-btn').classList.add('danger-active');
const dot = document.getElementById('micDot'); if (dot) dot.classList.add('muted');
}
if (!prejoinCamOn) {
document.getElementById('video-btn').classList.add('danger-active');
document.getElementById('localAvatar').classList.add('show');
}
if ("${myId}".includes('student')) connectToPeer();
}
peer.on('call', call => {
currentCall = call;
call.answer(localStream);
watchConnectionQuality(call);
call.on('stream', s => {
remoteStream = s;
showRemoteStream();
updateWbVideoTiles();
updateShareVideoTiles();
if (!callStartedFired) { callStartedFired = true; startTimer(); notifyParent('callStarted', { lessonId: LESSON_ID }); startPresence(); }
});
call.on('close', () => { setConnDot('bad'); });
});
function connectToPeer() {
currentCall = peer.call("${targetId}", localStream);
if (!currentCall) { scheduleCallRetry(); return; }
watchConnectionQuality(currentCall);
const streamTimeout = setTimeout(() => {
if (!callStartedFired) { try { currentCall.close(); } catch (e) {} scheduleCallRetry(); }
}, 9000);
currentCall.on('stream', s => {
clearTimeout(streamTimeout);
remoteStream = s;
showRemoteStream();
updateWbVideoTiles();
updateShareVideoTiles();
if (!callStartedFired) { callStartedFired = true; startTimer(); notifyParent('callStarted', { lessonId: LESSON_ID }); startPresence(); }
});
currentCall.on('close', () => {
clearTimeout(streamTimeout);
if (!callStartedFired) scheduleCallRetry(); else setConnDot('bad');
});
currentCall.on('error', () => { clearTimeout(streamTimeout); scheduleCallRetry(); });
}
function showRemoteStream() {
if (screenStream) return;
const v = document.getElementById('remoteVideo');
if (v && remoteStream) v.srcObject = remoteStream;
const label = document.getElementById('remoteLabel');
if (label) label.innerText = REMOTE_NAME;
const av = document.getElementById('remoteAvatar');
if (av) av.classList.remove('show');
const wrap = document.getElementById('remoteLabelWrap');
if (wrap) wrap.style.display = 'flex';
if (v) {
v.onloadedmetadata = () => updateRemoteVideoFit(v);
}
}

// The peer's camera might be landscape (typical desktop/laptop webcam, wide)
// while my own screen is portrait (typical phone) or vice-versa. object-fit:
// cover always fills the box by cropping - fine when both are a similar
// shape, but when they're mismatched it can crop away the actual person,
// leaving just a sliver of wall or shoulder. Switch to 'contain' (shows the
// whole frame, with letterboxing) whenever the shapes meaningfully disagree.
function updateRemoteVideoFit(v) {
if (!v || !v.videoWidth || !v.videoHeight) return;
const videoIsLandscape = v.videoWidth > v.videoHeight;
const boxIsLandscape = v.clientWidth > v.clientHeight;
v.style.objectFit = (videoIsLandscape !== boxIsLandscape) ? 'contain' : 'cover';
}
window.addEventListener('resize', () => {
const v = document.getElementById('remoteVideo');
if (v && v.srcObject) updateRemoteVideoFit(v);
});
function endCall() {
const modal = document.getElementById('leaveConfirmModal');
if (modal) modal.style.display = 'flex';
}
function reallyEndCall() {
const modal = document.getElementById('leaveConfirmModal');
if (modal) modal.style.display = 'none';
reportPresence('leave');
stopRecording(true);
try { if (localStream) localStream.getTracks().forEach(t => t.stop()); } catch (e) {}
try { if (screenStream) screenStream.getTracks().forEach(t => t.stop()); } catch (e) {}
try { if (currentCall) currentCall.close(); } catch (e) {}
try { peer.destroy(); } catch (e) {}
notifyParent('callEnded', { lessonId: LESSON_ID, role: isTeacher ? 'teacher' : 'student' });
}
function cancelEndCall() {
const modal = document.getElementById('leaveConfirmModal');
if (modal) modal.style.display = 'none';
}
async function toggleScreenShare() {
if (!screenShareSupported()) { flash('Screen sharing is not available on this device'); return; }
const btn = document.getElementById('share-btn');
try {
if (!screenStream) {
if (peerIsSharing) { flash(REMOTE_NAME + ' is sharing right now'); return; }
screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
const videoTrack = screenStream.getVideoTracks()[0];
replaceVideoTrack(videoTrack);
if (btn) btn.classList.add('success-active');
const big = document.getElementById('remoteVideo');
if (big) big.srcObject = screenStream;
const label = document.getElementById('remoteLabel');
if (label) label.innerText = 'You are sharing your screen';
showShareVideoBox();
sendState({ sharing: true });
videoTrack.onended = () => { if (screenStream) toggleScreenShare(); };
} else {
screenStream.getTracks().forEach(t => t.stop());
screenStream = null;
if (localStream) replaceVideoTrack(localStream.getVideoTracks()[0]);
if (btn) btn.classList.remove('success-active');
hideShareVideoBox();
sendState({ sharing: false });
showRemoteStream();
}
} catch (e) { screenStream = null; if (btn) btn.classList.remove('success-active'); }
}
let shareVideoDragBound = false;
let shareVideoLocked = false;
let shareVideoVertical = false;
function updateShareVideoTiles() {
const peerVid = document.getElementById('sharePeerVideo');
const localVid = document.getElementById('shareLocalVideo');
if (peerVid) {
if (remoteStream) { peerVid.srcObject = remoteStream; peerVid.style.display = 'block'; }
else peerVid.style.display = 'none';
}
if (localVid && localStream) localVid.srcObject = localStream;
}
function showShareVideoBox() {
const wrap = document.getElementById('localWrap');
if (wrap) wrap.style.display = 'none';
const box = document.getElementById('shareVideoBox');
if (box) box.style.display = 'flex';
updateShareVideoTiles();
if (!shareVideoDragBound && box) { makeDraggable(box); shareVideoDragBound = true; }
}
function hideShareVideoBox() {
const wrap = document.getElementById('localWrap');
if (wrap) wrap.style.display = 'block';
const box = document.getElementById('shareVideoBox');
if (box) box.style.display = 'none';
}
let wbVideoDragBound = false;
let wbVideoLocked = false;
function toggleWbVideoLock(evt) {
evt.stopPropagation();
wbVideoLocked = !wbVideoLocked;
const box = document.getElementById('wbVideoBox');
const icon = document.querySelector('#wbVideoLockToggle i');
if (box) box.classList.toggle('locked', wbVideoLocked);
if (icon) icon.className = wbVideoLocked ? 'fas fa-lock' : 'fas fa-lock-open';
}
function toggleShareVideoLock(evt) {
evt.stopPropagation();
shareVideoLocked = !shareVideoLocked;
const box = document.getElementById('shareVideoBox');
const icon = document.querySelector('#shareVideoLockToggle i');
if (box) box.classList.toggle('locked', shareVideoLocked);
if (icon) icon.className = shareVideoLocked ? 'fas fa-lock' : 'fas fa-lock-open';
}
function toggleShareVideoOrientation(evt) {
evt.stopPropagation();
shareVideoVertical = !shareVideoVertical;
const box = document.getElementById('shareVideoBox');
if (box) box.classList.toggle('vertical', shareVideoVertical);
}
function showSelfPreview(stream) {
const v = document.getElementById('localVideo');
if (v) v.srcObject = stream || null;
}
function replaceVideoTrack(track) {
if (!track || !currentCall || !currentCall.peerConnection) return;
const sender = currentCall.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
if (sender) { try { sender.replaceTrack(track); } catch (e) {} }
}
let presenceTimer = null;
function reportPresence(kind) { notifyParent('presence', { lessonId: LESSON_ID, event: kind }); }
function startPresence() {
if (presenceTimer) return;
reportPresence('join');
presenceTimer = setInterval(() => reportPresence('heartbeat'), 30000);
}
window.addEventListener('pagehide', () => { reportPresence('leave'); });
function flash(text) {
const b = document.getElementById('handBanner');
if (!b) return;
b.innerText = text;
b.classList.add('show');
clearTimeout(b._t);
b._t = setTimeout(() => b.classList.remove('show'), 3500);
}
function toggleMic() {
if (!localStream) return;
const audioTrack = localStream.getAudioTracks()[0];
audioTrack.enabled = !audioTrack.enabled;
document.getElementById('mic-btn').classList.toggle('danger-active', !audioTrack.enabled);
const dot = document.getElementById('micDot');
if (dot) dot.classList.toggle('muted', !audioTrack.enabled);
sendState({ mic: audioTrack.enabled });
}
function toggleVideo() {
if (!localStream) return;
const videoTrack = localStream.getVideoTracks()[0];
videoTrack.enabled = !videoTrack.enabled;
document.getElementById('video-btn').classList.toggle('danger-active', !videoTrack.enabled);
document.getElementById('localAvatar').classList.toggle('show', !videoTrack.enabled);
sendState({ cam: videoTrack.enabled });
}
function sendState(patch) {
if (dataConn && dataConn.open) dataConn.send(Object.assign({ type: 'state' }, patch));
}
function sendOwnState() {
if (!localStream) return;
const audioTrack = localStream.getAudioTracks()[0];
const videoTrack = localStream.getVideoTracks()[0];
sendState({ mic: audioTrack ? audioTrack.enabled : false, cam: videoTrack ? videoTrack.enabled : false, sharing: !!screenStream });
}
function applyPeerState(msg) {
if (typeof msg.mic === 'boolean') {
const el = document.getElementById('peerMic');
if (el) el.className = msg.mic ? 'fas fa-microphone ok' : 'fas fa-microphone-slash off';
}
if (typeof msg.cam === 'boolean') {
const el = document.getElementById('peerCam');
if (el) el.className = msg.cam ? 'fas fa-video ok' : 'fas fa-video-slash off';
const av = document.getElementById('remoteAvatar');
if (av) av.classList.toggle('show', !msg.cam);
const title = document.getElementById('waitingTitle');
if (title && callStartedFired) title.innerText = REMOTE_NAME + "'s camera is off";
}
if (msg.quality) {
const el = document.getElementById('cpTheirs');
if (el) el.innerText = QUALITY_TEXT[msg.quality] || 'Connecting';
}
if (typeof msg.sharing === 'boolean') {
peerIsSharing = msg.sharing;
if (msg.sharing) flash(REMOTE_NAME + ' started sharing their screen');
}
}
function toggleFullscreen() {
const el = document.documentElement;
if (!document.fullscreenElement) { el.requestFullscreen && el.requestFullscreen(); }
else { document.exitFullscreen && document.exitFullscreen(); }
}
function toggleNativePip() {
if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(() => {}); return; }
const video = document.getElementById('remoteVideo');
if (video && document.pictureInPictureEnabled && video.requestPictureInPicture) video.requestPictureInPicture().catch(() => {});
}
let handRaised = false;
function toggleRaiseHand() {
handRaised = !handRaised;
document.getElementById('hand-btn').classList.toggle('accent-active', handRaised);
if (dataConn && dataConn.open) dataConn.send({ type: 'hand', raised: handRaised, sender: USER_NAME });
if (handRaised) showHandBanner(USER_NAME + ' raised a hand');
}
function showHandBanner(text) {
const b = document.getElementById('handBanner');
b.innerText = text;
b.classList.add('show');
clearTimeout(b._t);
b._t = setTimeout(() => b.classList.remove('show'), 4000);
}
function toggleReactionPicker() { document.getElementById('reactionPicker').classList.toggle('open'); }

function toggleMoreMenu(evt) {
  evt.stopPropagation();
  const menu = document.getElementById('moreMenu');
  if (menu) menu.classList.toggle('open');
}
function closeMoreMenu() {
  const menu = document.getElementById('moreMenu');
  if (menu) menu.classList.remove('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('moreMenu');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !e.target.closest('#more-btn')) {
    menu.classList.remove('open');
  }
});

// --- Live captions (speech-to-text only, no translation) ---------------
// Uses the browser's own free built-in speech recognition (Chrome/Edge/Safari
// desktop support it; Chrome Android does too - iOS Safari mobile does not).
// Each side transcribes its OWN mic locally, then sends the text to the peer
// over the same WebRTC data channel already used for chat/whiteboard, so both
// participants see captions for whoever is talking.
let captionsOn = false;
let recognizer = null;
let captionHideTimer = null;

function captionsSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function screenShareSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
}

function showCaption(sender, text, isFinal) {
  const bar = document.getElementById('captionsBar');
  if (!bar || !text) return;
  bar.innerHTML = '<span class="cc-speaker">' + (sender || '') + '</span>' + text;
  bar.classList.add('show');
  clearTimeout(captionHideTimer);
  if (isFinal) {
    captionHideTimer = setTimeout(() => { bar.classList.remove('show'); }, 4000);
  }
}

function sendCaption(text, isFinal) {
  if (dataConn && dataConn.open) dataConn.send({ type: 'caption', sender: USER_NAME, text, final: isFinal });
}

function startCaptions() {
  if (!captionsSupported()) { flash('Live captions are not supported on this browser'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognizer = new SR();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.onresult = (event) => {
    let text = '';
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    text = text.trim();
    if (!text) return;
    showCaption(USER_NAME, text, isFinal);
    sendCaption(text, isFinal);
  };
  recognizer.onerror = () => {
    // Auto-restart on transient errors (e.g. brief silence timeouts) while captions are still on
    if (captionsOn) { try { recognizer.start(); } catch (e) {} }
  };
  recognizer.onend = () => {
    if (captionsOn) { try { recognizer.start(); } catch (e) {} }
  };
  try { recognizer.start(); } catch (e) {}
}

function stopCaptions() {
  if (recognizer) { try { recognizer.stop(); } catch (e) {} recognizer = null; }
  const bar = document.getElementById('captionsBar');
  if (bar) bar.classList.remove('show');
}

function toggleCaptions() {
  captionsOn = !captionsOn;
  const btn = document.getElementById('cc-btn');
  if (btn) btn.classList.toggle('accent-active', captionsOn);
  if (captionsOn) startCaptions(); else stopCaptions();
}
let mediaRecorder = null, recordedChunks = [], recCanvas = null, recTimer = null, recAudioCtx = null;
function recordingSupported() {
return !!(window.MediaRecorder && HTMLCanvasElement.prototype.captureStream);
}
function drawRecordingFrame() {
if (!recCanvas) return;
const ctx = recCanvas.getContext('2d');
const W = recCanvas.width, H = recCanvas.height;
const drawFit = (src, x, y, w, h) => {
if (!src) return;
const sw = src.videoWidth || src.width, sh = src.videoHeight || src.height;
if (!sw || !sh) return;
const scale = Math.min(w / sw, h / sh);
const dw = sw * scale, dh = sh * scale;
try { ctx.drawImage(src, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); } catch (e) {}
};
const wbModal = document.getElementById('whiteboardModal');
const wbOpen = wbModal && wbModal.style.display === 'flex';
if (wbOpen) {
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, W, H);
const wbRoot = document.getElementById('excalidrawRoot');
if (wbRoot) {
const canvases = wbRoot.querySelectorAll('canvas');
canvases.forEach((c) => {
if (!c.width || !c.height) return;
try { ctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, W, H); } catch (e) {}
});
}
drawFit(document.getElementById('wbPeerVideo'), W - 220, H - 170, 100, 75);
drawFit(document.getElementById('wbLocalVideo'), W - 110, H - 170, 100, 75);
} else {
ctx.fillStyle = '#0a0a0c';
ctx.fillRect(0, 0, W, H);
drawFit(document.getElementById('remoteVideo'), 0, 0, W, H);
drawFit(document.getElementById('localVideo'), W - 270, H - 210, 250, 190);
}
}
async function toggleRecording() {
const btn = document.getElementById('rec-btn');
if (mediaRecorder) { stopRecording(false); return; }
if (!recordingSupported()) { flash('Recording is not supported on this device'); return; }
if (!localStream) { flash('Wait until your camera is ready'); return; }
try {
recCanvas = document.createElement('canvas');
recCanvas.width = 1280; recCanvas.height = 720;
recTimer = setInterval(drawRecordingFrame, 40);
const mixedStream = recCanvas.captureStream(25);
try {
recAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const dest = recAudioCtx.createMediaStreamDestination();
if (localStream && localStream.getAudioTracks().length) {
recAudioCtx.createMediaStreamSource(new MediaStream(localStream.getAudioTracks())).connect(dest);
}
if (remoteStream && remoteStream.getAudioTracks().length) {
recAudioCtx.createMediaStreamSource(new MediaStream(remoteStream.getAudioTracks())).connect(dest);
}
dest.stream.getAudioTracks().forEach(t => mixedStream.addTrack(t));
} catch (e) {}
recordedChunks = [];
mediaRecorder = new MediaRecorder(mixedStream);
mediaRecorder.ondataavailable = ev => { if (ev.data && ev.data.size) recordedChunks.push(ev.data); };
mediaRecorder.onstop = () => { saveRecording(); };
mediaRecorder.start(1000);
if (btn) btn.classList.add('danger-active');
const ind = document.getElementById('recDot');
if (ind) ind.style.display = 'flex';
sendState({ recording: true });
flash('Recording — the file is saved on your device');
} catch (e) { cleanupRecording(); flash('Could not start recording'); }
}
function cleanupRecording() {
if (recTimer) { clearInterval(recTimer); recTimer = null; }
if (recAudioCtx) { try { recAudioCtx.close(); } catch (e) {} recAudioCtx = null; }
recCanvas = null;
mediaRecorder = null;
}
function stopRecording(silent) {
if (!mediaRecorder) return;
try { mediaRecorder.stop(); } catch (e) {}
cleanupRecording();
const btn = document.getElementById('rec-btn');
if (btn) btn.classList.remove('danger-active');
const ind = document.getElementById('recDot');
if (ind) ind.style.display = 'none';
if (!silent) sendState({ recording: false });
}
function saveRecording() {
if (!recordedChunks.length) return;
const blob = new Blob(recordedChunks, { type: 'video/webm' });
downloadBlob(blob, 'lesson-' + LESSON_ID + '.webm');
recordedChunks = [];
}
function downloadBlob(blob, name) {
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = name;
document.body.appendChild(a); a.click();
setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
}
document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('#reactionPicker button').forEach(btn => {
btn.onclick = () => { sendReaction(btn.getAttribute('data-e')); document.getElementById('reactionPicker').classList.remove('open'); };
});
if (!recordingSupported()) {
const rb = document.getElementById('rec-btn');
if (rb) rb.style.display = 'none';
}
if (!captionsSupported()) {
const cc = document.getElementById('cc-btn');
if (cc) cc.style.display = 'none';
}
if (!screenShareSupported()) {
const sb = document.getElementById('share-btn');
if (sb) sb.style.display = 'none';
}
const video = document.getElementById('remoteVideo');
const btn = document.getElementById('pip-btn');
if (video) {
video.addEventListener('enterpictureinpicture', () => { if (btn) btn.classList.add('accent-active'); });
video.addEventListener('leavepictureinpicture', () => { if (btn) btn.classList.remove('accent-active'); });
}
initKeyboardShortcuts();
initTimeLeftCheck();
initLateJoinCheck();
initCameraOffNudge();
initAudioQualityWatch();
initLocalCameraDrag();
});
let localCamLocked = false;
function makeDraggableByHandle(handleEl, moveEl) {
let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
handleEl.addEventListener('mousedown', (e) => {
dragging = true;
startX = e.clientX; startY = e.clientY;
const rect = moveEl.getBoundingClientRect();
const parentRect = moveEl.offsetParent ? moveEl.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
startLeft = rect.left - parentRect.left; startTop = rect.top - parentRect.top;
e.preventDefault();
e.stopPropagation();
});
window.addEventListener('mousemove', (e) => {
if (!dragging) return;
const dx = e.clientX - startX; const dy = e.clientY - startY;
moveEl.style.left = Math.max(4, startLeft + dx) + 'px';
moveEl.style.top = Math.max(4, startTop + dy) + 'px';
});
window.addEventListener('mouseup', () => { dragging = false; });
}
function makeDraggable(el, onDragEnd) {
let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

function getPoint(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
  if (e.target.closest('.lock-toggle') || e.target.closest('.mobile-cam-toggle')) return;
  if (el.classList.contains('locked')) return;
  dragging = true; el.classList.add('dragging');
  const p = getPoint(e);
  startX = p.x; startY = p.y;
  const rect = el.getBoundingClientRect();
  const parentRect = el.offsetParent ? el.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
  startLeft = rect.left - parentRect.left; startTop = rect.top - parentRect.top;
  if (e.cancelable) e.preventDefault();
}

function onDragMove(e) {
  if (!dragging) return;
  const p = getPoint(e);
  const dx = p.x - startX; const dy = p.y - startY;
  const parentRect = el.offsetParent ? el.offsetParent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
  const maxLeft = Math.max(4, parentRect.width - el.offsetWidth - 4);
  const maxTop = Math.max(4, parentRect.height - el.offsetHeight - 4);
  el.style.left = Math.min(maxLeft, Math.max(4, startLeft + dx)) + 'px';
  el.style.top = Math.min(maxTop, Math.max(4, startTop + dy)) + 'px';
  el.style.right = 'auto'; el.style.bottom = 'auto';
  if (e.cancelable) e.preventDefault();
}

function onDragEndHandler() {
  if (dragging && onDragEnd) onDragEnd();
  dragging = false; el.classList.remove('dragging');
}

el.addEventListener('mousedown', onDragStart);
window.addEventListener('mousemove', onDragMove);
window.addEventListener('mouseup', onDragEndHandler);

el.addEventListener('touchstart', onDragStart, { passive: false });
window.addEventListener('touchmove', onDragMove, { passive: false });
window.addEventListener('touchend', onDragEndHandler);
window.addEventListener('touchcancel', onDragEndHandler);
}
function toggleLocalLock(evt) {
evt.stopPropagation();
localCamLocked = !localCamLocked;
const wrap = document.getElementById('localWrap');
const icon = document.querySelector('#localLockToggle i');
if (wrap) wrap.classList.toggle('locked', localCamLocked);
if (icon) icon.className = localCamLocked ? 'fas fa-lock' : 'fas fa-lock-open';
}
let mobileLocalVideoHidden = false;
function toggleMobileLocalVideo(evt) {
evt.stopPropagation();
mobileLocalVideoHidden = !mobileLocalVideoHidden;
const wrap = document.getElementById('localWrap');
const icon = document.querySelector('#mobileCamToggle i');
if (wrap) wrap.classList.toggle('mobile-hidden', mobileLocalVideoHidden);
if (icon) icon.className = mobileLocalVideoHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}
function initLocalCameraDrag() {
const wrap = document.getElementById('localWrap');
if (wrap) makeDraggable(wrap);
}
function initKeyboardShortcuts() {
window.addEventListener('keydown', (e) => {
const tag = (e.target && e.target.tagName || '').toLowerCase();
if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
if (e.code === 'Space') { e.preventDefault(); toggleMic(); }
else if (e.key === 'r' || e.key === 'R') { toggleRecording(); }
else if (e.key === 'w' || e.key === 'W') { if (enableWhiteboardFlag) window.openWhiteboard ? (document.getElementById('whiteboardModal').style.display === 'flex' ? window.closeWhiteboard() : window.openWhiteboard()) : null; }
});
}
function toggleFocusMode() {
const vp = document.getElementById('viewport');
vp.classList.toggle('focus-mode');
const btn = document.getElementById('focus-btn');
if (btn) btn.classList.toggle('accent-active');
}
function manualReconnect() {
try { if (!peer.destroyed) peer.reconnect(); } catch (e) {}
if (!callStartedFired) connectToPeer();
if (!(dataConn && dataConn.open)) connectDataChannel();
flash('Reconnecting...');
}
function initTimeLeftCheck() {
if (!LESSON_END_ISO) return;
const check = () => {
const end = new Date(LESSON_END_ISO).getTime();
const now = Date.now();
const chip = document.getElementById('timeLeftChip');
if (!chip) return;
const minsLeft = Math.round((end - now) / 60000);
if (minsLeft > 0 && minsLeft <= 5) { chip.style.display = 'inline-block'; chip.innerText = minsLeft + ' min left'; }
else chip.style.display = 'none';
};
check();
setInterval(check, 30000);
}
let lateJoinDismissed = false;
function initLateJoinCheck() {
setTimeout(() => {
if (!callStartedFired && !lateJoinDismissed) {
const banner = document.getElementById('lateJoinBanner');
const text = document.getElementById('lateJoinText');
if (text) text.innerText = REMOTE_NAME + " hasn't joined yet.";
if (banner) banner.style.display = 'flex';
}
}, 180000);
}
function sendLateJoinReminder() {
notifyParent('lateJoinReminder', { lessonId: LESSON_ID, remoteName: REMOTE_NAME });
flash('Reminder sent');
dismissLateJoinBanner();
}
function dismissLateJoinBanner() {
lateJoinDismissed = true;
const banner = document.getElementById('lateJoinBanner');
if (banner) banner.style.display = 'none';
}
let cameraOffSince = null;
function initCameraOffNudge() {
setInterval(() => {
if (!localStream) return;
const videoTrack = localStream.getVideoTracks()[0];
if (!videoTrack || !videoTrack.enabled) {
if (!cameraOffSince) cameraOffSince = Date.now();
else if (Date.now() - cameraOffSince > 120000) {
let nudge = document.getElementById('cameraOffNudge');
if (!nudge) {
nudge = document.createElement('div');
nudge.id = 'cameraOffNudge';
nudge.className = 'camera-off-nudge';
nudge.innerText = 'Your camera has been off for a while';
document.getElementById('viewport').appendChild(nudge);
setTimeout(() => { nudge.remove(); }, 6000);
}
cameraOffSince = Date.now() + 300000;
}
} else cameraOffSince = null;
}, 20000);
}
function initAudioQualityWatch() {
setInterval(() => {
if (!currentCall || !currentCall.peerConnection) return;
currentCall.peerConnection.getStats(null).then((stats) => {
let packetsLost = 0, packetsTotal = 0;
stats.forEach((r) => {
if (r.type === 'inbound-rtp' && r.kind === 'audio') { packetsLost += r.packetsLost || 0; packetsTotal += (r.packetsReceived || 0) + (r.packetsLost || 0); }
});
const icon = document.getElementById('audioQualityIcon');
if (!icon || !packetsTotal) return;
const lossRatio = packetsLost / packetsTotal;
icon.className = lossRatio > 0.05 ? 'fas fa-volume-up' : 'fas fa-volume-up';
icon.style.color = lossRatio > 0.08 ? '#ef4444' : (lossRatio > 0.03 ? '#f59e0b' : '#22c55e');
}).catch(() => {});
}, 8000);
}
async function toggleDevicePicker(evt, kind) {
evt.stopPropagation();
const picker = document.getElementById('devicePicker');
const wasOpen = picker.classList.contains('open');
picker.classList.remove('open');
stopDeviceMicMeter();
if (wasOpen) return;
try {
const devices = await navigator.mediaDevices.enumerateDevices();
const list = devices.filter(d => d.kind === (kind === 'audio' ? 'audioinput' : 'videoinput'));
const activeTrack = localStream ? (kind === 'audio' ? localStream.getAudioTracks()[0] : localStream.getVideoTracks()[0]) : null;
const activeSettings = activeTrack ? activeTrack.getSettings() : {};
const activeDeviceId = activeSettings.deviceId;
let html = list.length ? list.map(d => {
const isActive = d.deviceId === activeDeviceId;
return '<div data-id="' + d.deviceId + '" title="' + (d.label || '') + '" class="' + (isActive ? 'active' : '') + '">' + (isActive ? '<i class="fas fa-check"></i> ' : '') + truncateLabel(d.label || (kind === 'audio' ? 'Microphone' : 'Camera'), 20) + '</div>';
}).join('') : '<div style="color:#6a6a6a">No devices found</div>';
if (kind === 'audio') html += '<div class="device-mic-meter-row"><i class="fas fa-microphone"></i><div class="device-mic-meter"><div class="device-mic-meter-bar" id="deviceMicMeterBar"></div></div></div>';
picker.innerHTML = html;
const triggerBtn = document.getElementById(kind === 'audio' ? 'mic-btn' : 'video-btn');
const wrap = document.querySelector('.toolbar-wrap');
if (triggerBtn && wrap) {
const btnRect = triggerBtn.getBoundingClientRect();
const wrapRect = wrap.getBoundingClientRect();
picker.style.left = (btnRect.left - wrapRect.left) + 'px';
}
picker.classList.add('open');
if (kind === 'audio' && localStream) startDeviceMicMeter(localStream);
picker.querySelectorAll('div[data-id]').forEach(el => {
el.onclick = async () => {
picker.classList.remove('open');
stopDeviceMicMeter();
try {
const constraints = kind === 'audio' ? { audio: { deviceId: { exact: el.getAttribute('data-id') } }, video: false } : { video: { deviceId: { exact: el.getAttribute('data-id') } }, audio: false };
const wasEnabled = localStream ? (kind === 'audio' ? localStream.getAudioTracks()[0] : localStream.getVideoTracks()[0])?.enabled : true;
const newStream = await navigator.mediaDevices.getUserMedia(constraints);
const newTrack = kind === 'audio' ? newStream.getAudioTracks()[0] : newStream.getVideoTracks()[0];
if (wasEnabled === false) newTrack.enabled = false;
if (localStream) {
const oldTracks = kind === 'audio' ? localStream.getAudioTracks() : localStream.getVideoTracks();
oldTracks.forEach(t => { localStream.removeTrack(t); t.stop(); });
localStream.addTrack(newTrack);
}
if (kind === 'video') { showSelfPreview(localStream); replaceVideoTrack(newTrack); }
else if (currentCall && currentCall.peerConnection) {
const sender = currentCall.peerConnection.getSenders().find(s => s.track && s.track.kind === 'audio');
if (sender) sender.replaceTrack(newTrack);
}
if (kind === 'audio') {
document.getElementById('mic-btn').classList.toggle('danger-active', !newTrack.enabled);
const dot = document.getElementById('micDot');
if (dot) dot.classList.toggle('muted', !newTrack.enabled);
sendState({ mic: newTrack.enabled });
} else {
document.getElementById('video-btn').classList.toggle('danger-active', !newTrack.enabled);
document.getElementById('localAvatar').classList.toggle('show', !newTrack.enabled);
sendState({ cam: newTrack.enabled });
}
} catch (e) { flash('Could not switch device'); }
};
});
} catch (e) {}
}
let deviceMicAudioCtx = null, deviceMicRaf = null;
function startDeviceMicMeter(stream) {
try {
deviceMicAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = deviceMicAudioCtx.createMediaStreamSource(stream);
const analyser = deviceMicAudioCtx.createAnalyser();
analyser.fftSize = 512;
source.connect(analyser);
const data = new Uint8Array(analyser.frequencyBinCount);
const tick = () => {
analyser.getByteFrequencyData(data);
let sum = 0;
for (let i = 0; i < data.length; i++) sum += data[i];
const level = Math.min(100, Math.round((sum / data.length) * 1.8));
const bar = document.getElementById('deviceMicMeterBar');
if (bar) bar.style.width = level + '%';
deviceMicRaf = requestAnimationFrame(tick);
};
tick();
} catch (e) {}
}
function stopDeviceMicMeter() {
if (deviceMicRaf) cancelAnimationFrame(deviceMicRaf);
if (deviceMicAudioCtx) { try { deviceMicAudioCtx.close(); } catch (e) {} }
deviceMicAudioCtx = null; deviceMicRaf = null;
}
document.addEventListener('click', (e) => {
const picker = document.getElementById('devicePicker');
if (picker && !picker.contains(e.target) && !e.target.closest('.device-caret')) { picker.classList.remove('open'); stopDeviceMicMeter(); }
});
function sendReaction(emoji) {
spawnReactionFloat(emoji);
if (dataConn && dataConn.open) dataConn.send({ type: 'reaction', emoji });
}
function spawnReactionFloat(emoji) {
const el = document.createElement('div');
el.className = 'reaction-float';
el.innerText = emoji;
el.style.left = (40 + Math.random() * 20) + '%';
el.style.bottom = '110px';
document.getElementById('viewport').appendChild(el);
setTimeout(() => el.remove(), 2300);
}
let isLockedForStudent = false;
let isTeacher = IS_TEACHER;
let dataConn = null;
let chatUnread = 0;
let chatPanelOpen = false;
function resyncWhiteboardToPeer() {
if (window.__excalidrawAPI && dataConn && dataConn.open) {
const els = window.__excalidrawAPI.getSceneElements();
const filesMap = window.__excalidrawAPI.getFiles ? window.__excalidrawAPI.getFiles() : {};
wbSentFileIds = new Set(Object.keys(filesMap));
dataConn.send({ type: 'whiteboard', action: 'full', payload: JSON.stringify({ elements: els, files: Object.values(filesMap) }), sender: isTeacher ? 'teacher' : 'student' });
}
}
if (!isTeacher) { connectDataChannel(); }
else {
peer.on('connection', (conn) => {
dataConn = conn;
conn.on('data', (data) => { applyRemoteUpdate(data); });
conn.on('open', () => { setDataStatus('Connected'); resyncWhiteboardToPeer(); sendOwnState(); });
conn.on('close', () => { dataConn = null; });
});
}
function connectDataChannel() {
const conn = peer.connect("${targetId}");
const dataOpenTimeout = setTimeout(() => {
if (!(dataConn && dataConn.open)) scheduleDataRetry();
}, 9000);
conn.on('open', () => { clearTimeout(dataOpenTimeout); dataConn = conn; dataConnectAttempts = 0; setDataStatus('Connected'); resyncWhiteboardToPeer(); sendOwnState(); });
conn.on('data', (data) => { applyRemoteUpdate(data); });
conn.on('close', () => { clearTimeout(dataOpenTimeout); dataConn = null; setDataStatus('Reconnecting'); scheduleDataRetry(); });
conn.on('error', () => { clearTimeout(dataOpenTimeout); dataConn = null; scheduleDataRetry(); });
}
function sendWhiteboardUpdate(action, payload) {
if (!isTeacher && isLockedForStudent && action !== 'open' && action !== 'close') return;
if (dataConn && dataConn.open) dataConn.send({ type: 'whiteboard', action, payload, sender: isTeacher ? 'teacher' : 'student' });
}
let wbApplyingRemote = false;
function applyRemoteUpdate(msg) {
if (!msg || !msg.type) return;
if (msg.type === 'chat') { appendChatMessage(msg, false); playNotifySound(); hideTypingIndicator(); return; }
if (msg.type === 'typing') { showTypingIndicator(msg.sender); return; }
if (msg.type === 'reaction') { spawnReactionFloat(msg.emoji); return; }
if (msg.type === 'caption') { showCaption(msg.sender, msg.text, msg.final); return; }
if (msg.type === 'hand') { if (msg.raised) { showHandBanner((msg.sender || REMOTE_NAME) + ' raised a hand'); playNotifySound(); } return; }
if (msg.type === 'state') { applyPeerState(msg); return; }
if (msg.type !== 'whiteboard') return;
const { action, payload } = msg;
if (action === 'open') { ensureWhiteboardVisible(); }
else if (action === 'close') { reallyCloseWhiteboard(); }
else if (action === 'full') {
if (!window.__excalidrawRoot) window.mountExcalidraw();
const applyIt = () => {
if (!window.__excalidrawAPI) { setTimeout(applyIt, 150); return; }
wbApplyingRemote = true;
const data = JSON.parse(payload);
const els = Array.isArray(data) ? data : data.elements;
const filesArr = Array.isArray(data) ? [] : (data.files || []);
if (filesArr.length && window.__excalidrawAPI.addFiles) window.__excalidrawAPI.addFiles(filesArr);
window.__excalidrawAPI.updateScene({ elements: els });
setTimeout(() => { wbApplyingRemote = false; }, 250);
notifyParentWhiteboardChange();
};
applyIt();
}
else if (action === 'lockState') {
isLockedForStudent = payload;
const overlay = document.getElementById('wbLockOverlay');
if (overlay) overlay.style.display = (!isTeacher && isLockedForStudent) ? 'block' : 'none';
}
}
function appendChatMessage(msg, isMine) {
const container = document.getElementById('chatMessages');
const bubble = document.createElement('div');
bubble.className = 'chat-msg ' + (isMine ? 'mine' : 'theirs');
const senderLabel = document.createElement('span');
senderLabel.innerText = msg.sender || (isMine ? USER_NAME : REMOTE_NAME);
const text = document.createElement('span');
text.innerText = msg.text || '';
bubble.appendChild(senderLabel);
bubble.appendChild(text);
container.appendChild(bubble);
container.scrollTop = container.scrollHeight;
if (!isMine && !chatPanelOpen) {
chatUnread++;
const badge = document.getElementById('chatBadge');
if (badge) { badge.style.display = 'flex'; badge.innerText = String(chatUnread); }
const badgeMenu = document.getElementById('chatBadgeMenu');
if (badgeMenu) badgeMenu.style.display = 'inline-block';
}
}
function sendChatMessage(text) {
if (!text) return;
const msg = { sender: USER_NAME, text, timestamp: Date.now(), fromTeacher: isTeacher, lessonId: LESSON_ID };
appendChatMessage(msg, true);
if (dataConn && dataConn.open) dataConn.send({ type: 'chat', ...msg });
notifyParent('chatMessage', msg);
}
function sendChatFromInput() {
const input = document.getElementById('chatInput');
const text = (input.value || '').trim();
if (!text) return;
sendChatMessage(text);
input.value = '';
}
let typingSendTimer = null;
function notifyTyping() {
if (typingSendTimer) return;
if (dataConn && dataConn.open) dataConn.send({ type: 'typing', sender: USER_NAME });
typingSendTimer = setTimeout(() => { typingSendTimer = null; }, 2500);
}
function showTypingIndicator(sender) {
const el = document.getElementById('typingInd');
if (!el) return;
el.innerText = (sender || REMOTE_NAME) + ' is typing...';
el.style.display = 'block';
clearTimeout(showTypingIndicator._t);
showTypingIndicator._t = setTimeout(hideTypingIndicator, 3000);
}
function hideTypingIndicator() { const el = document.getElementById('typingInd'); if (el) el.style.display = 'none'; }
function clearChatHistory() {
const container = document.getElementById('chatMessages');
if (container) container.innerHTML = '';
}
let notifyAudioCtx = null;
function playNotifySound() {
try {
if (!notifyAudioCtx) notifyAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const osc = notifyAudioCtx.createOscillator();
const gain = notifyAudioCtx.createGain();
osc.frequency.value = 720;
gain.gain.setValueAtTime(0.08, notifyAudioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, notifyAudioCtx.currentTime + 0.25);
osc.connect(gain); gain.connect(notifyAudioCtx.destination);
osc.start(); osc.stop(notifyAudioCtx.currentTime + 0.25);
} catch (e) {}
}
function toggleChatPanel() {
const panel = document.getElementById('chatPanel');
chatPanelOpen = !chatPanelOpen;
panel.classList.toggle('open', chatPanelOpen);
document.getElementById('chat-btn') && document.getElementById('chat-btn').classList.toggle('accent-active', chatPanelOpen);
if (chatPanelOpen) { chatUnread = 0; const badge = document.getElementById('chatBadge'); if (badge) badge.style.display = 'none'; const badgeMenu = document.getElementById('chatBadgeMenu'); if (badgeMenu) badgeMenu.style.display = 'none'; }
}
let wbSaveTimer = null;
function notifyParentWhiteboardChange(immediate) {
if (wbApplyingRemote) return;
if (wbSaveTimer) clearTimeout(wbSaveTimer);
const doSave = () => {
if (!window.__excalidrawAPI) return;
const els = window.__excalidrawAPI.getSceneElements();
notifyParent('whiteboardChanged', JSON.stringify({ elements: els }));
const hint = document.getElementById('wbSavedHint');
if (hint) { hint.innerText = 'Saved a moment ago'; clearTimeout(hint._t); hint._t = setTimeout(() => { hint.innerText = ''; }, 4000); }
};
if (immediate) doSave(); else wbSaveTimer = setTimeout(doSave, 1200);
}
let pendingSavedState = null;
function applyLoadedState(stateStr) {
pendingSavedState = stateStr;
reallyApplyPendingState();
}
function reallyApplyPendingState() {
if (!pendingSavedState) return;
const tryApply = () => {
if (!window.__excalidrawAPI) { setTimeout(tryApply, 200); return; }
try {
const data = JSON.parse(pendingSavedState);
if (data && data.elements) window.__excalidrawAPI.updateScene({ elements: data.elements });
} catch (e) {}
pendingSavedState = null;
};
tryApply();
}
let wbChangeThrottleTimer = null;
window.onExcalidrawReady = function() {
if (pendingSavedState) reallyApplyPendingState();
};
let wbSerializeWorker = null;
function getWbSerializeWorker() {
if (wbSerializeWorker) return wbSerializeWorker;
try {
const workerCode = "self.onmessage = function(e) { try { const json = JSON.stringify(e.data); self.postMessage({ ok: true, json: json }); } catch (err) { self.postMessage({ ok: false }); } };";
const blob = new Blob([workerCode], { type: 'application/javascript' });
wbSerializeWorker = new Worker(URL.createObjectURL(blob));
} catch (e) { wbSerializeWorker = null; }
return wbSerializeWorker;
}
let wbPointerDown = false;
let wbPendingSyncElements = null;
let wbActiveToolIsPen = false;
let wbSentFileIds = new Set();
window.onExcalidrawChange = function(elements, appState, files) {
if (wbApplyingRemote) return;
wbActiveToolIsPen = !!(appState && appState.activeTool && appState.activeTool.type === 'freedraw');
if (wbActiveToolIsPen && wbPointerDown) { wbPendingSyncElements = elements; return; }
if (wbChangeThrottleTimer) return;
wbChangeThrottleTimer = setTimeout(() => {
wbChangeThrottleTimer = null;
flushWbSync(elements, files);
}, 120);
};
function flushWbSync(elements, files) {
const newFiles = [];
if (files) {
Object.keys(files).forEach((id) => {
if (!wbSentFileIds.has(id)) { newFiles.push(files[id]); wbSentFileIds.add(id); }
});
}
const worker = getWbSerializeWorker();
const payloadObj = { elements: elements, files: newFiles };
if (worker) {
worker.onmessage = (e) => {
if (e.data && e.data.ok) { sendWhiteboardUpdate('full', e.data.json); notifyParentWhiteboardChange(); }
};
worker.postMessage(payloadObj);
} else {
setTimeout(() => { sendWhiteboardUpdate('full', JSON.stringify(payloadObj)); notifyParentWhiteboardChange(); }, 0);
}
}
document.addEventListener('pointerdown', (e) => {
if (e.target && e.target.closest && e.target.closest('#excalidrawRoot')) wbPointerDown = true;
});
document.addEventListener('pointerup', () => {
if (!wbPointerDown) return;
wbPointerDown = false;
if (wbPendingSyncElements) {
const els = wbPendingSyncElements;
wbPendingSyncElements = null;
flushWbSync(els);
}
});
function ensureWhiteboardVisible() {
const modal = document.getElementById('whiteboardModal');
const peerVid = document.getElementById('wbPeerVideo');
const localVid = document.getElementById('wbLocalVideo');
if (peerVid) {
if (remoteStream) { peerVid.srcObject = remoteStream; peerVid.style.display = 'block'; }
else peerVid.style.display = 'none';
}
if (localVid && localStream) localVid.srcObject = localStream;
if (!wbVideoDragBound) {
const box = document.getElementById('wbVideoBox');
if (box) { makeDraggable(box); wbVideoDragBound = true; }
}
if (modal.style.display === 'flex') { window.mountExcalidraw(); return; }
modal.style.display = 'flex';
window.mountExcalidraw();
const overlay = document.getElementById('wbLockOverlay');
if (overlay) overlay.style.display = (!isTeacher && isLockedForStudent) ? 'block' : 'none';
}
window.openWhiteboard = function() {
const modal = document.getElementById('whiteboardModal');
const wasAlreadyOpen = modal.style.display === 'flex';
ensureWhiteboardVisible();
if (!wasAlreadyOpen) sendWhiteboardUpdate('open', null);
};
function reallyCloseWhiteboard() {
const m = document.getElementById('whiteboardModal');
if (m) m.style.display = 'none';
}
window.closeWhiteboard = function() {
const m = document.getElementById('whiteboardModal');
const wasOpen = m && m.style.display === 'flex';
reallyCloseWhiteboard();
if (wasOpen) sendWhiteboardUpdate('close', null);
};
function toggleWbLockForStudent() {
if (!isTeacher) return;
isLockedForStudent = !isLockedForStudent;
sendWhiteboardUpdate('lockState', isLockedForStudent);
updateWbLockButton();
}
function updateWbLockButton() {
const btn = document.getElementById('lockWb');
if (!btn) return;
btn.classList.toggle('active', isLockedForStudent);
btn.classList.add('lock-flip');
setTimeout(() => btn.classList.remove('lock-flip'), 320);
const icon = btn.querySelector('i');
if (icon) icon.className = isLockedForStudent ? 'fas fa-lock' : 'fas fa-lock-open';
}
function saveWhiteboardImage() {
if (!window.__excalidrawAPI) { flash('Open the whiteboard first'); return; }
const win = wwLib.getFrontWindow();
import('https://esm.sh/@excalidraw/excalidraw@0.18.0?external=react,react-dom').then((mod) => {
const els = window.__excalidrawAPI.getSceneElements();
mod.exportToBlob({ elements: els, appState: window.__excalidrawAPI.getAppState(), files: window.__excalidrawAPI.getFiles() }).then((blob) => {
const url = URL.createObjectURL(blob);
const a = win.document.createElement('a');
a.href = url;
a.download = 'whiteboard-' + LESSON_ID + '.png';
win.document.body.appendChild(a); a.click(); a.remove();
setTimeout(() => URL.revokeObjectURL(url), 2000);
}).catch(() => flash('Could not export the whiteboard'));
}).catch(() => flash('Could not export the whiteboard'));
}
window.addEventListener('message', (e) => {
const msg = e.data;
if (!msg || !msg.action) return;
if (msg.action === 'toggleWhiteboard') {
const modal = document.getElementById('whiteboardModal');
if (modal.style.display === 'flex') window.closeWhiteboard(); else window.openWhiteboard();
} else if (msg.action === 'startScreenShare') toggleScreenShare();
else if (msg.action === 'loadWhiteboardState') applyLoadedState(msg.payload);
});
<\/script>
</body>
</html>`;
},
},
watch: {
'content.savedWhiteboardState'(newVal) { if (newVal) this.loadWhiteboardState(newVal); },
},
mounted() {
this._msgHandler = (event) => {
if (!this.$refs.zoomIframe || event.source !== this.$refs.zoomIframe.contentWindow) return;
const data = event.data;
if (!data || !data.type) return;
if (data.type === 'presence') this.$emit('trigger-event', { name: 'presence', event: { value: JSON.stringify(data.payload || {}) } });
else if (data.type === 'lateJoinReminder') this.$emit('trigger-event', { name: 'lateJoinReminderRequested', event: { value: JSON.stringify(data.payload || {}) } });
else if (data.type === 'whiteboardChanged') this.$emit('trigger-event', { name: 'whiteboardChanged', event: { value: data.payload } });
else if (data.type === 'chatMessage') this.$emit('trigger-event', { name: 'chatMessageSent', event: { value: data.payload } });
else if (data.type === 'callStarted') this.$emit('trigger-event', { name: 'callStarted', event: { value: JSON.stringify(data.payload || {}) } });
else if (data.type === 'callEnded') this.$emit('trigger-event', { name: 'callEnded', event: { value: JSON.stringify(data.payload || {}) } });
};
const win = wwLib.getFrontWindow();
win.addEventListener('message', this._msgHandler);
if (this.content?.savedWhiteboardState) {
this._initialLoadTimer = setTimeout(() => { this.loadWhiteboardState(this.content.savedWhiteboardState); }, 1500);
}
},
beforeUnmount() {
const win = wwLib.getFrontWindow();
if (this._msgHandler) win.removeEventListener('message', this._msgHandler);
if (this._initialLoadTimer) clearTimeout(this._initialLoadTimer);
},
methods: {
postToIframe(msg) { const win = this.$refs.zoomIframe && this.$refs.zoomIframe.contentWindow; if (win) win.postMessage(msg, '*'); },
toggleWhiteboard() { if (this.isEditing) return; this.postToIframe({ action: 'toggleWhiteboard' }); },
startScreenShare() { if (this.isEditing) return; this.postToIframe({ action: 'startScreenShare' }); },
loadWhiteboardState(state) { if (this.isEditing || !state) return; this.postToIframe({ action: 'loadWhiteboardState', payload: state }); },
},
};
</script>
<style lang="scss" scoped>
    .ww-zoom-workspace {
        position: relative;
        width: 100%;
        background: #000;
    }

    .ww-zoom-workspace .iframe-holder {
        width: 100%;
        height: 100%;
        border: none;
    }

    .ww-zoom-workspace .placeholder {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0a0a0a;
    }

    .ww-zoom-workspace .placeholder .msg-box {
        text-align: center;
        color: white;
        padding: 40px;
        border: 1px solid #333;
        border-radius: 20px;
        background: #111;
    }
</style>