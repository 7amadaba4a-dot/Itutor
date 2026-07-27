import { vi } from 'vitest';
import 'vitest-canvas-mock';
import { ref } from 'vue';

// happy-dom doesn't ship ResizeObserver. Chart.js uses it for responsive sizing.
// A no-op stub is enough for tests — Chart.js never relies on the callback firing.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub);

// Stub the wwLib global the way WeWeb's editor does in its own vitest.setup.ts.
// Components built for WeWeb expect this global to exist at runtime.
vi.stubGlobal('wwLib', {
    wwVariable: {
        useComponentVariable: ({ defaultValue }) => {
            const v = ref(defaultValue);
            return { value: v, setValue: (x) => { v.value = x; } };
        },
    },
    getFrontDocument: () => globalThis.document,
    getFrontWindow: () => globalThis.window,
});
