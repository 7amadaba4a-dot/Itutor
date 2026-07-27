<template>
    <div class="ww-video-vimeo" ref="videoPlayer" :class="{ editing: isEditing }"></div>
</template>

<script>
import { nextTick } from 'vue';
import Vimeo from '@vimeo/player';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
    },
    emits: ['update:content', 'update:sidepanel-content', 'trigger-event'],
    setup(props) {
        const player = null;
        const { variableValue: isPlayingVariableValue, setValue: setIsPlayingValue } =
            wwLib.wwVariable.useComponentVariable({
                uid: props.uid,
                name: 'Is Playing',
                type: 'boolean',
                defaultValue: false,
                readonly: true,
            });
        const { variableValue: currentTimeVariableValue, setValue: setCurrentTimeValue } =
            wwLib.wwVariable.useComponentVariable({
                uid: props.uid,
                name: 'Current time',
                type: 'number',
                defaultValue: 0,
                readonly: true,
            });

        return { player, isPlayingVariableValue, setIsPlayingValue, currentTimeVariableValue, setCurrentTimeValue };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        videoUrl() {
            if (!this.content.url || typeof this.content.url !== 'string') return '';
            // handle unlisted videos
            const path = this.content.url.split('m/')[1]?.split('/');
            return path.length > 1 ? `https://player.vimeo.com/video/${path[0]}?h=${path[1]}` : this.content.url;
        },
    },
    watch: {
        isEditing() {
            this.initPlayer();
        },
        'content.url'() {
            this.initPlayer();
        },
        'content.videoStartTime'() {
            this.initPlayer();
        },
        'content.controls'() {
            this.initPlayer();
        },
        'content.loop'(value) {
            if (this.player) this.player.setLoop(value);
        },
        'content.muted'(value) {
            if (this.player) this.player.setMuted(value);
        },
        'content.autoplay'(value) {
            if (!this.content.muted) this.$emit('update:content', { muted: true });
            if (value && this.player) this.player.play();
        },
    },
    methods: {
        async initPlayer() {
            if (this.player) await this.player.destroy();
            await nextTick();

            const el = this.$refs.videoPlayer;
            let options = {
                url: this.videoUrl,
                controls: this.content.controls,
            };
            this.player = new Vimeo(el, options);


            this.setIsPlayingValue(false);
            this.player.setCurrentTime(this.content.videoStartTime);
            this.player.setLoop(this.content.loop);
            this.player.setMuted(this.content.muted);

            // Dont play the video & dont init events in edition mode
            if (this.isEditing) return;

            if (this.content.autoplay) this.player.play();

            this.player.on('timeupdate', data => {
                this.setCurrentTimeValue(data.seconds);
            });

            this.player.on('play', data => {
                this.setIsPlayingValue(true);
                this.$emit('trigger-event', { name: 'play', event: { value: data.seconds } });
            });

            this.player.on('pause', data => {
                this.setIsPlayingValue(false);
                if (Math.floor(data.seconds) === Math.floor(data.duration)) {
                    this.$emit('trigger-event', { name: 'end', event: { value: data.seconds } });
                } else {
                    this.$emit('trigger-event', { name: 'pause', event: { value: data.seconds } });
                }
            });
        },
        playVideo() {
            if (!this.player) return;
            this.player.play();
        },
        pauseVideo() {
            if (!this.player) return;
            this.player.pause();
        },
        seekTo(time) {
            if (!this.player) return;
            this.player.setCurrentTime(time);
        },
    },
    beforeUnmount() {
        if (this.player) {
            this.player.off('timeupdate');
            this.player.off('play');
            this.player.off('pause');
            this.player.off('ended');
        }
    },
    mounted() {
        this.initPlayer();
    },
};
</script>

<style lang="scss">
.ww-video-vimeo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 9;

    &.editing::after {
        content: '';
        position: absolute;
        inset: 0;
    }

    iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
