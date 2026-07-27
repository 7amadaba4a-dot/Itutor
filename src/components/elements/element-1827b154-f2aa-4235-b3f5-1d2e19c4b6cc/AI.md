---
name: ww-video-vimeo
description: The `ww-video-vimeo` component seamlessly embeds a Vimeo video player into a website, offering control over playback features such as autoplay, mute, loop, and specific start times, while integrating with the Vimeo player API for enhanced video management.
keywords: vimeo video player, embed vimeo video, autoplay, video mute, video loop, video controls, vimeo player api, video playback events, dynamic property binding, video seek time
---

#### ww-video-vimeo

***Purpose:***
Renders a Vimeo video player within a website with playback control features.

***Features:***
- Vimeo player API integration
- Video playback control
- Dynamic property binding support

***Properties:***
- url: string - Vimeo video URL. Default: ""
- videoStartTime: number - Start time in seconds. Default: 0
- autoplay: boolean - Auto start playback. Default: false
- muted: boolean - Initial mute state. Default: false
- loop: boolean - Loop playback. Default: false
- controls: boolean - Show video controls. Default: true

***Events:***
- play: Triggered when video starts playing. Value is current time in seconds. Payload: {value: number}
- pause: Triggered when video is paused. Value is current time in seconds. Payload: {value: number}
- end: Triggered when video reaches the end. Value is current time in seconds. Payload: {value: number}

***Exposed Variables:***
- Is Playing: boolean - Indicates if video is currently playing  (Path: variables['current_element_uid-Is Playing'])
- Current time: number - Current playback time in seconds  (Path: variables['current_element_uid-Current time'])

***Exposed Element Actions:***
- playVideo: (no args) Play video
- pauseVideo: (no args) Pause video
- seekTo: (arg1 (time in seconds): number) Go to time

***Notes:***
 Do not set element or parent element height to 0 : a combination of width to 100% & aspectRatio to 16/9 will ensure the video is displayed correctly.
