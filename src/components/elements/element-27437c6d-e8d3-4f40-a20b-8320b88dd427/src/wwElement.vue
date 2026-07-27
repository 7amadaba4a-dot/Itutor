<template>
    <div class="cropper-root">
        <div
            class="crop-stage"
            ref="stageRef"
            @mousedown="onDragStart"
            @touchstart="onDragStart"
            @wheel.prevent="onWheel"
        >
            <img
                v-if="props.content?.imageUrl"
                :src="props.content.imageUrl"
                ref="imgRef"
                class="crop-image"
                :style="imageStyle"
                draggable="false"
                @load="onImageLoad"
            />
            <div v-else class="crop-placeholder">No image</div>
            <div class="crop-overlay"></div>
        </div>
        <div class="crop-controls">
            <input type="range" min="1" max="4" step="0.01" v-model.number="zoom" class="crop-zoom" />
            <button
                type="button"
                class="crop-confirm-btn"
                @click="confirmCrop"
                :disabled="!props.content?.imageUrl"
            >
                {{ props.content?.confirmButtonLabel || 'Confirm crop' }}
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed, reactive } from 'vue';

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const isEditing = computed(() => {
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const { setValue: setCroppedImage } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'croppedImage',
            type: 'string',
            defaultValue: '',
        });

        const STAGE_SIZE = 320;

        const stageRef = ref(null);
        const imgRef = ref(null);
        const zoom = ref(1);
        const pos = reactive({ x: 0, y: 0 });
        const naturalSize = reactive({ w: 0, h: 0 });
        const dragging = reactive({ active: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
        const baseScale = ref(1);

        function onImageLoad(e) {
            naturalSize.w = e.target.naturalWidth;
            naturalSize.h = e.target.naturalHeight;
            // Scale so the image always fully covers the circular stage at zoom = 1
            baseScale.value = Math.max(STAGE_SIZE / naturalSize.w, STAGE_SIZE / naturalSize.h);
            zoom.value = 1;
            pos.x = 0;
            pos.y = 0;
        }

        const imageStyle = computed(() => {
            const scale = baseScale.value * zoom.value;
            const w = naturalSize.w ? naturalSize.w * scale : 0;
            const h = naturalSize.h ? naturalSize.h * scale : 0;
            return {
                width: w ? `${w}px` : 'auto',
                height: h ? `${h}px` : 'auto',
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: w ? `-${w / 2}px` : '0',
                marginTop: h ? `-${h / 2}px` : '0',
                cursor: dragging.active ? 'grabbing' : 'grab',
            };
        });

        function onDragStart(e) {
            if (isEditing.value) return;
            const point = e.touches ? e.touches[0] : e;
            dragging.active = true;
            dragging.startX = point.clientX;
            dragging.startY = point.clientY;
            dragging.startPosX = pos.x;
            dragging.startPosY = pos.y;
            const win = wwLib.getFrontWindow();
            win.addEventListener('mousemove', onDragMove);
            win.addEventListener('mouseup', onDragEnd);
            win.addEventListener('touchmove', onDragMove, { passive: false });
            win.addEventListener('touchend', onDragEnd);
        }
        function onDragMove(e) {
            if (!dragging.active) return;
            if (e.cancelable) e.preventDefault();
            const point = e.touches ? e.touches[0] : e;
            pos.x = dragging.startPosX + (point.clientX - dragging.startX);
            pos.y = dragging.startPosY + (point.clientY - dragging.startY);
        }
        function onDragEnd() {
            dragging.active = false;
            const win = wwLib.getFrontWindow();
            win.removeEventListener('mousemove', onDragMove);
            win.removeEventListener('mouseup', onDragEnd);
            win.removeEventListener('touchmove', onDragMove);
            win.removeEventListener('touchend', onDragEnd);
        }
        function onWheel(e) {
            if (isEditing.value) return;
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            zoom.value = Math.min(4, Math.max(1, zoom.value + delta));
        }

        function confirmCrop() {
            if (isEditing.value) return;
            if (!imgRef.value || !naturalSize.w) return;
            const size = Number(props.content?.outputSize) || 500;
            const doc = wwLib.getFrontDocument();
            const canvas = doc.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            const scale = baseScale.value * zoom.value;
            const imgW = naturalSize.w * scale;
            const imgH = naturalSize.h * scale;
            const imgLeft = STAGE_SIZE / 2 - imgW / 2 + pos.x;
            const imgTop = STAGE_SIZE / 2 - imgH / 2 + pos.y;

            const sx = (0 - imgLeft) / scale;
            const sy = (0 - imgTop) / scale;
            const sSize = STAGE_SIZE / scale;

            ctx.drawImage(imgRef.value, sx, sy, sSize, sSize, 0, 0, size, size);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setCroppedImage(dataUrl);
            emit('trigger-event', { name: 'cropped', event: { value: dataUrl } });
        }

        function resetCrop() {
            zoom.value = 1;
            pos.x = 0;
            pos.y = 0;
        }

        return {
            props,
            stageRef,
            imgRef,
            zoom,
            imageStyle,
            onDragStart,
            onWheel,
            onImageLoad,
            confirmCrop,
            resetCrop,
        };
    },
};
</script>

<style scoped>
.cropper-root {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}
.crop-stage {
    position: relative;
    width: 320px;
    height: 320px;
    overflow: hidden;
    border-radius: 50%;
    background: #F1F5F9;
    border: 2px solid #E2E8F0;
    touch-action: none;
    user-select: none;
}
.crop-image {
    user-select: none;
    -webkit-user-drag: none;
}
.crop-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #94A3B8;
    font-size: 14px;
}
.crop-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
    pointer-events: none;
}
.crop-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 320px;
}
.crop-zoom {
    width: 100%;
}
.crop-confirm-btn {
    background: #0d9488;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}
.crop-confirm-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
