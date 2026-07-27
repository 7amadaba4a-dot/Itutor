<template>
    <div class="tzy-wb-root" :style="rootStyle">
        <div class="tzy-wb-header">
            <span class="tzy-wb-title">Interactive Whiteboard</span>
            <span class="tzy-wb-savehint" v-if="savedHint">{{ savedHint }}</span>
            <span class="tzy-wb-actions">
                <button class="tzy-wb-btn tzy-wb-save" @click="saveImage" title="Save as image"><i class="fas fa-download"></i> Save</button>
                <button class="tzy-wb-btn tzy-wb-close" @click="requestClose" title="Close"><i class="fas fa-xmark"></i></button>
            </span>
        </div>

        <div class="tzy-wb-toolbar" v-if="!isLocked || isTeacher">
            <button class="tzy-wb-tool" :class="{ active: tool === 'select' }" @click="setTool('select')" title="Select"><i class="fas fa-arrow-pointer"></i></button>
            <button class="tzy-wb-tool" :class="{ active: tool === 'pen' }" @click="setTool('pen')" title="Pen"><i class="fas fa-pen"></i></button>
            <button class="tzy-wb-tool" :class="{ active: tool === 'highlighter' }" @click="setTool('highlighter')" title="Highlighter"><i class="fas fa-highlighter"></i></button>
            <button class="tzy-wb-tool" :class="{ active: tool === 'eraser' }" @click="setTool('eraser')" title="Eraser"><i class="fas fa-eraser"></i></button>
            <button class="tzy-wb-tool" :class="{ active: tool === 'laser' }" @click="setTool('laser')" title="Laser pointer"><i class="fas fa-location-crosshairs"></i></button>
            <button class="tzy-wb-tool" @click="addText" title="Text"><i class="fas fa-font"></i></button>
            <button class="tzy-wb-tool" @click="addSticky" title="Sticky note"><i class="fas fa-note-sticky"></i></button>
            <button class="tzy-wb-tool" @click="addRect" title="Rectangle"><i class="fas fa-square"></i></button>
            <button class="tzy-wb-tool" @click="addCircle" title="Circle"><i class="fas fa-circle"></i></button>
            <button class="tzy-wb-tool" @click="addLine" title="Line"><i class="fas fa-slash"></i></button>
            <span v-for="c in swatchColors" :key="c" class="tzy-wb-swatch" :class="{ active: color === c }" :style="{ background: c }" @click="pickColor(c)"></span>
            <input type="color" class="tzy-wb-colorpick" v-model="color" title="Custom color" @change="onColorChange" />
            <input type="range" class="tzy-wb-width" min="1" max="30" v-model.number="width" title="Stroke width" @input="onWidthChange" />
            <button class="tzy-wb-tool" @click="undo" title="Undo"><i class="fas fa-rotate-left"></i></button>
            <button class="tzy-wb-tool" @click="redo" title="Redo"><i class="fas fa-rotate-right"></i></button>
            <button class="tzy-wb-tool" @click="clearCanvas" title="Clear all"><i class="fas fa-trash"></i></button>
            <button class="tzy-wb-tool" @click="setGridBackground" title="Grid background"><i class="fas fa-border-all"></i></button>
            <button class="tzy-wb-tool" @click="setLinedBackground" title="Lined background"><i class="fas fa-grip-lines"></i></button>
            <button class="tzy-wb-tool" @click="triggerUpload" title="Insert image"><i class="fas fa-image"></i></button>
            <input type="file" ref="fileInput" accept="image/*" class="tzy-wb-hidden-input" @change="onFileChosen" />
            <button class="tzy-wb-tool" @click="prevPage" title="Previous page"><i class="fas fa-chevron-left"></i></button>
            <span class="tzy-wb-page-indicator">Page {{ currentPage + 1 }}</span>
            <button class="tzy-wb-tool" @click="nextPage" title="Next page"><i class="fas fa-chevron-right"></i></button>
            <button class="tzy-wb-tool tzy-wb-wide" @click="addPage" title="Add page"><i class="fas fa-plus"></i> Page</button>
            <button v-if="isTeacher" class="tzy-wb-tool tzy-wb-wide" :class="{ active: isLocked }" @click="toggleLock" title="Lock drawing for student"><i class="fas fa-lock"></i> Lock student</button>
        </div>
        <div v-else class="tzy-wb-locked-note">The teacher has locked drawing right now.</div>

        <div class="tzy-wb-canvas-area" ref="canvasArea">
            <canvas ref="canvasEl"></canvas>
            <div class="tzy-wb-laser" ref="laserDot" v-show="laserVisible" :style="laserStyle"><span class="tzy-wb-laser-tag">{{ laserSender }}</span></div>
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
            fabric: null,
            canvas: null,
            tool: 'pen',
            color: '#111827',
            width: 3,
            swatchColors: ['#111827', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'],
            historyStack: [],
            historyIndex: -1,
            pages: [],
            currentPage: 0,
            isLocked: false,
            laserActive: false,
            laserVisible: false,
            laserSender: '',
            laserX: 0,
            laserY: 0,
            savedHint: '',
            savedHintTimer: null,
            saveDebounceTimer: null,
            _loadedInitial: false,
            _laserHideTimer: null,
        };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        isTeacher() {
            return this.content?.isTeacher === true;
        },
        rootStyle() {
            return { '--tzy-accent': this.content?.accentColor || '#007bff' };
        },
        laserStyle() {
            return { left: (this.laserX * 100) + '%', top: (this.laserY * 100) + '%' };
        },
    },
    watch: {
        'content.locked'(v) {
            this.isLocked = !!v;
        },
        'content.savedState'(v) {
            if (v && !this._loadedInitial) this.applyInitialState(v);
        },
    },
    mounted() {
        this.isLocked = this.content?.locked === true;
        this.ensureIconFont();
        this.loadFabricScript().then((lib) => {
            this.fabric = lib;
            this.$nextTick(() => {
                this.initCanvas();
                if (this.content?.savedState) this.applyInitialState(this.content.savedState);
            });
        }).catch(() => { /* the canvas area stays empty if the CDN script fails to load */ });
    },
    beforeUnmount() {
        clearTimeout(this.saveDebounceTimer);
        clearTimeout(this.savedHintTimer);
        clearTimeout(this._laserHideTimer);
        if (this.canvas) { try { this.canvas.dispose(); } catch (e) { /* noop */ } }
    },
    methods: {
        // ---------- setup ----------
        loadFabricScript() {
            return new Promise((resolve, reject) => {
                const win = wwLib.getFrontWindow();
                const doc = wwLib.getFrontDocument();
                if (win.fabric) { resolve(win.fabric); return; }
                let el = doc.getElementById('tzy-wb-fabric-script');
                if (el) {
                    el.addEventListener('load', () => resolve(win.fabric));
                    el.addEventListener('error', reject);
                    return;
                }
                el = doc.createElement('script');
                el.id = 'tzy-wb-fabric-script';
                el.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
                el.onload = () => resolve(win.fabric);
                el.onerror = reject;
                doc.head.appendChild(el);
            });
        },
        ensureIconFont() {
            const doc = wwLib.getFrontDocument();
            if (doc.getElementById('tzy-wb-fa-font')) return;
            const link = doc.createElement('link');
            link.id = 'tzy-wb-fa-font';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            doc.head.appendChild(link);
        },
        initCanvas() {
            const area = this.$refs.canvasArea;
            if (!area || !this.$refs.canvasEl) return;
            this.canvas = new this.fabric.Canvas(this.$refs.canvasEl, {
                width: area.clientWidth || 800,
                height: area.clientHeight || 500,
                backgroundColor: '#ffffff',
                selection: true,
            });
            this.canvas.on('object:added', () => this.saveToHistory());
            this.canvas.on('object:modified', () => this.saveToHistory());
            this.canvas.on('path:created', () => this.saveToHistory());
            this.canvas.on('mouse:up', () => {
                if (this.tool === 'pen' || this.tool === 'eraser' || this.tool === 'highlighter') this.broadcastFull();
            });
            let throttleTimer = null;
            const throttledSync = () => {
                if (throttleTimer) return;
                throttleTimer = setTimeout(() => { throttleTimer = null; this.broadcastFull(); }, 140);
            };
            this.canvas.on('object:moving', throttledSync);
            this.canvas.on('object:scaling', throttledSync);
            this.canvas.on('mouse:move', (opt) => {
                if (this.tool === 'laser' && this.laserActive) {
                    const p = this.canvas.getPointer(opt.e);
                    this.sendLaserPoint(p.x / this.canvas.width, p.y / this.canvas.height);
                } else if (this.canvas.isDrawingMode && opt.e.buttons === 1) {
                    throttledSync();
                }
            });
            this.setPen();
            this.saveToHistory();
            this.pages[0] = JSON.stringify(this.canvas.toJSON());
        },
        applyBrush(color, width) {
            this.canvas.isDrawingMode = true;
            this.canvas.selection = false;
            this.canvas.freeDrawingBrush.color = color;
            this.canvas.freeDrawingBrush.width = width;
        },
        setTool(name) {
            if (this.isLocked && !this.isTeacher) return;
            this.laserActive = false;
            this.tool = name;
            if (name === 'select') { this.canvas.isDrawingMode = false; this.canvas.selection = true; this.hideLaser(); }
            else if (name === 'pen') { this.applyBrush(this.color, this.width); this.hideLaser(); }
            else if (name === 'highlighter') { this.canvas.isDrawingMode = true; this.canvas.selection = false; this.canvas.freeDrawingBrush.color = this.color + '55'; this.canvas.freeDrawingBrush.width = Math.max(this.width * 3, 14); this.hideLaser(); }
            else if (name === 'eraser') { this.applyBrush('#ffffff', Math.max(this.width, 10)); this.hideLaser(); }
            else if (name === 'laser') { this.laserActive = true; this.canvas.isDrawingMode = false; this.canvas.selection = false; }
        },
        setPen() { this.setTool('pen'); },
        pickColor(c) {
            if (this.isLocked && !this.isTeacher) return;
            this.color = c;
            if (this.tool === 'pen') this.setTool('pen');
            if (this.tool === 'highlighter') this.setTool('highlighter');
            const active = this.canvas.getActiveObject();
            if (active && active.set) { active.set('stroke', c); this.canvas.renderAll(); }
        },
        onColorChange() { this.pickColor(this.color); },
        onWidthChange() {
            if (this.tool === 'pen') this.canvas.freeDrawingBrush.width = this.width;
            if (this.tool === 'highlighter') this.canvas.freeDrawingBrush.width = Math.max(this.width * 3, 14);
        },

        // ---------- shapes ----------
        addText() {
            if (this.isLocked && !this.isTeacher) return;
            this.setTool('select');
            const t = new this.fabric.IText('Text', { left: 100, top: 100, fontSize: 22, fill: this.color });
            this.canvas.add(t); this.canvas.setActiveObject(t); this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },
        addSticky() {
            if (this.isLocked && !this.isTeacher) return;
            this.setTool('select');
            const noteColors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'];
            const nc = noteColors[Math.floor(Math.random() * noteColors.length)];
            const group = new this.fabric.Group([
                new this.fabric.Rect({ width: 160, height: 140, fill: nc, rx: 6, ry: 6 }),
                new this.fabric.Textbox('Note...', { width: 140, left: -70, top: -60, fontSize: 15, fill: '#1f2937' }),
            ], { left: 220, top: 160 });
            this.canvas.add(group); this.canvas.setActiveObject(group); this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },
        addRect() {
            if (this.isLocked && !this.isTeacher) return;
            this.setTool('select');
            const r = new this.fabric.Rect({ left: 200, top: 200, width: 100, height: 70, fill: 'transparent', stroke: this.color, strokeWidth: this.width });
            this.canvas.add(r); this.canvas.setActiveObject(r); this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },
        addCircle() {
            if (this.isLocked && !this.isTeacher) return;
            this.setTool('select');
            const c = new this.fabric.Circle({ left: 300, top: 200, radius: 45, fill: 'transparent', stroke: this.color, strokeWidth: this.width });
            this.canvas.add(c); this.canvas.setActiveObject(c); this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },
        addLine() {
            if (this.isLocked && !this.isTeacher) return;
            this.setTool('select');
            const l = new this.fabric.Line([300, 300, 420, 300], { stroke: this.color, strokeWidth: this.width });
            this.canvas.add(l); this.canvas.setActiveObject(l); this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },

        // ---------- history / background / image ----------
        saveToHistory() {
            if (!this.canvas) return;
            const state = JSON.stringify(this.canvas.toJSON(['selectable', 'hasControls', 'hasBorders']));
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
            this.historyStack.push(state);
            this.historyIndex++;
            if (this.historyStack.length > 50) this.historyStack.shift();
            this.scheduleChangedEvent();
        },
        undo() {
            if (this.isLocked && !this.isTeacher) return;
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.canvas.loadFromJSON(this.historyStack[this.historyIndex], () => this.canvas.renderAll());
                this.broadcast('undo', null);
            }
        },
        redo() {
            if (this.isLocked && !this.isTeacher) return;
            if (this.historyIndex < this.historyStack.length - 1) {
                this.historyIndex++;
                this.canvas.loadFromJSON(this.historyStack[this.historyIndex], () => this.canvas.renderAll());
                this.broadcast('redo', null);
            }
        },
        clearCanvas() {
            if (this.isLocked && !this.isTeacher) return;
            this.canvas.clear(); this.canvas.backgroundColor = '#ffffff'; this.canvas.renderAll();
            this.saveToHistory(); this.broadcast('clear', null);
        },
        setGridBackground() {
            if (this.isLocked && !this.isTeacher) return;
            this.canvas.clear();
            const g = 30;
            for (let i = 0; i < this.canvas.width / g; i++) {
                this.canvas.add(new this.fabric.Line([i * g, 0, i * g, this.canvas.height], { stroke: '#ddd', selectable: false, evented: false }));
                this.canvas.add(new this.fabric.Line([0, i * g, this.canvas.width, i * g], { stroke: '#ddd', selectable: false, evented: false }));
            }
            this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },
        setLinedBackground() {
            if (this.isLocked && !this.isTeacher) return;
            this.canvas.clear();
            for (let y = 40; y < this.canvas.height; y += 40) {
                this.canvas.add(new this.fabric.Line([0, y, this.canvas.width, y], { stroke: '#bbb', strokeWidth: 1, selectable: false, evented: false }));
            }
            this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
        },
        triggerUpload() {
            if (this.isLocked && !this.isTeacher) return;
            if (this.$refs.fileInput) this.$refs.fileInput.click();
        },
        onFileChosen(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.fabric.Image.fromURL(ev.target.result, (img) => {
                    img.scaleToWidth(300); this.canvas.add(img); this.canvas.renderAll(); this.saveToHistory(); this.broadcastFull();
                });
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        },

        // ---------- pages ----------
        saveCurrentPage() { this.pages[this.currentPage] = JSON.stringify(this.canvas.toJSON()); },
        loadPageIndex(index) {
            if (!this.pages[index]) { this.canvas.clear(); this.canvas.backgroundColor = '#fff'; this.canvas.renderAll(); return; }
            this.canvas.loadFromJSON(this.pages[index], () => this.canvas.renderAll());
        },
        addPage() {
            if (this.isLocked && !this.isTeacher) return;
            this.saveCurrentPage();
            this.currentPage = this.pages.length;
            this.pages.push(null);
            this.canvas.clear(); this.canvas.backgroundColor = '#fff'; this.canvas.renderAll();
            this.loadPageIndex(this.currentPage);
            this.broadcast('pageChange', { page: this.currentPage });
            this.scheduleChangedEvent();
        },
        nextPage() {
            if (this.currentPage < this.pages.length - 1) {
                this.saveCurrentPage(); this.currentPage++; this.loadPageIndex(this.currentPage);
                this.broadcast('pageChange', { page: this.currentPage });
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.saveCurrentPage(); this.currentPage--; this.loadPageIndex(this.currentPage);
                this.broadcast('pageChange', { page: this.currentPage });
            }
        },

        // ---------- lock ----------
        toggleLock() {
            if (!this.isTeacher) return;
            this.isLocked = !this.isLocked;
            this.broadcast('lockState', this.isLocked);
        },

        // ---------- laser ----------
        sendLaserPoint(x, y) {
            this.broadcast('laser', { x, y });
            this.showLaserAt(x, y, this.isTeacher ? 'You' : 'You');
        },
        showLaserAt(x, y, sender) {
            this.laserX = x; this.laserY = y; this.laserSender = sender || '';
            this.laserVisible = true;
        },
        hideLaser() { this.laserVisible = false; },

        // ---------- save image ----------
        saveImage() {
            if (!this.canvas) return;
            try {
                const data = this.canvas.toDataURL({ format: 'png', backgroundColor: '#ffffff' });
                const win = wwLib.getFrontWindow();
                const doc = wwLib.getFrontDocument();
                const a = doc.createElement('a');
                a.href = data;
                a.download = 'whiteboard-page' + (this.currentPage + 1) + '.png';
                doc.body.appendChild(a); a.click(); a.remove();
            } catch (e) { /* noop */ }
        },

        // ---------- outbound sync ----------
        broadcast(action, payload) {
            if (this.isEditing) return;
            const msg = { type: 'whiteboard', action, payload, sender: this.isTeacher ? 'teacher' : 'student' };
            this.$emit('trigger-event', { name: 'sendUpdate', event: { value: JSON.stringify(msg) } });
        },
        broadcastFull() {
            if (!this.canvas) return;
            this.broadcast('full', JSON.stringify(this.canvas.toJSON()));
        },
        scheduleChangedEvent() {
            if (!this.canvas) return;
            clearTimeout(this.saveDebounceTimer);
            this.saveDebounceTimer = setTimeout(() => {
                this.$emit('trigger-event', {
                    name: 'changed',
                    event: { value: JSON.stringify({ pages: this.pages, currentPage: this.currentPage, canvasState: this.canvas.toJSON() }) },
                });
                this.savedHint = 'Saved a moment ago';
                clearTimeout(this.savedHintTimer);
                this.savedHintTimer = setTimeout(() => { this.savedHint = ''; }, 4000);
            }, 1200);
        },

        // ---------- inbound sync (called as an action from the page) ----------
        receiveUpdate(payloadJson) {
            if (!this.canvas) return;
            let msg;
            try { msg = typeof payloadJson === 'string' ? JSON.parse(payloadJson) : payloadJson; } catch (e) { return; }
            if (!msg || msg.type !== 'whiteboard') return;
            if (this.isLocked && !this.isTeacher && msg.action !== 'full') return;
            const { action, payload } = msg;
            if (action === 'full') { this.canvas.loadFromJSON(payload, () => this.canvas.renderAll()); }
            else if (action === 'clear') { this.canvas.clear(); this.canvas.backgroundColor = '#fff'; this.canvas.renderAll(); }
            else if (action === 'undo') this.undoRemote();
            else if (action === 'redo') this.redoRemote();
            else if (action === 'pageChange') { this.currentPage = payload.page; this.loadPageIndex(this.currentPage); }
            else if (action === 'lockState') { this.isLocked = payload; }
            else if (action === 'laser') {
                if (payload && payload.x !== null && payload.x !== undefined) {
                    this.showLaserAt(payload.x, payload.y, payload.sender);
                    clearTimeout(this._laserHideTimer);
                    this._laserHideTimer = setTimeout(() => this.hideLaser(), 2500);
                } else this.hideLaser();
            }
        },
        undoRemote() { if (this.historyIndex > 0) { this.historyIndex--; this.canvas.loadFromJSON(this.historyStack[this.historyIndex], () => this.canvas.renderAll()); } },
        redoRemote() { if (this.historyIndex < this.historyStack.length - 1) { this.historyIndex++; this.canvas.loadFromJSON(this.historyStack[this.historyIndex], () => this.canvas.renderAll()); } },

        // ---------- initial load (from DB) ----------
        applyInitialState(stateStr) {
            if (!this.canvas) return;
            this._loadedInitial = true;
            try {
                const data = JSON.parse(stateStr);
                this.pages = data.pages || [];
                this.currentPage = data.currentPage || 0;
                if (this.pages[this.currentPage]) this.loadPageIndex(this.currentPage);
                else if (data.canvasState) this.canvas.loadFromJSON(data.canvasState, () => this.canvas.renderAll());
            } catch (e) { /* an empty/invalid saved state just starts blank */ }
        },

        // ---------- callable actions ----------
        loadState(stateJson) { if (this.isEditing || !stateJson) return; this.applyInitialState(stateJson); },
        requestClose() { if (this.isEditing) return; this.$emit('trigger-event', { name: 'closeRequested', event: { value: '' } }); },
    },
};
</script>

<style lang="scss" scoped>
    .tzy-wb-root { width: 100%; height: 100%; display: flex; flex-direction: column; background: #fff; border-radius: 16px; overflow: hidden; }
    .tzy-wb-header { background: #1f2937; padding: 10px 18px; display: flex; align-items: center; gap: 12px; color: white; }
    .tzy-wb-title { font-weight: 600; font-size: 14px; }
    .tzy-wb-savehint { font-size: 12px; color: rgba(255,255,255,0.55); }
    .tzy-wb-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    .tzy-wb-btn { background: rgba(255,255,255,0.12); color: white; padding: 6px 12px; border-radius: 8px; cursor: pointer; border: none; font-size: 13px; }
    .tzy-wb-close { background: rgba(239,68,68,0.2); color: #fca5a5; padding: 6px 10px; }
    .tzy-wb-toolbar { background: #f3f4f6; padding: 8px 10px; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
    .tzy-wb-locked-note { background: #fef3c7; color: #92400e; padding: 8px 14px; font-size: 13px; }
    .tzy-wb-tool { background: transparent; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; color: #374151; }
    .tzy-wb-tool.active { background: var(--tzy-accent); color: white; }
    .tzy-wb-tool.tzy-wb-wide { width: auto; padding: 0 10px; gap: 6px; font-size: 12px; }
    .tzy-wb-swatch { width: 18px; height: 18px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; display: inline-block; }
    .tzy-wb-swatch.active { border-color: #111827; }
    .tzy-wb-colorpick { width: 26px; height: 26px; padding: 0; border: none; background: none; }
    .tzy-wb-width { width: 70px; }
    .tzy-wb-hidden-input { display: none; }
    .tzy-wb-page-indicator { font-size: 12px; color: #6b7280; padding: 0 4px; }
    .tzy-wb-canvas-area { flex: 1; background: #fafafa; position: relative; min-height: 200px; }
    .tzy-wb-canvas-area canvas { width: 100% !important; height: 100% !important; }
    .tzy-wb-laser { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #ef4444; pointer-events: none; transform: translate(-50%, -50%); z-index: 5; }
    .tzy-wb-laser-tag { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 10px; white-space: nowrap; background: rgba(0,0,0,0.7); color: white; padding: 1px 6px; border-radius: 6px; }
</style>
