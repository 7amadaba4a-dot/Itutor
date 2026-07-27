<template>
    <wwEditorInputRow
        :model-value="recipients"
        label="Recipients"
        type="array"
        bindable
        @update:modelValue="setRecipients"
        @add-item="setRecipients([...(recipients || []), ''])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item"
                placeholder="Enter an email"
                bindable
                small
                @update:modelValue="setItem($event)"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorInputRow
        type="query"
        :model-value="subject"
        label="Subject"
        placeholder="Enter a value"
        required
        bindable
        @update:modelValue="setSubject"
    />
    <wwEditorInputRow
        type="code"
        language="html"
        :model-value="content"
        label="Content"
        placeholder="You can use HTML tags"
        required
        bindable
        @update:modelValue="setContent"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        recipients() {
            return this.args.recipients || [];
        },
        subject() {
            return this.args.subject;
        },
        content() {
            return this.args.content;
        },
    },
    methods: {
        setRecipients(recipients) {
            this.$emit('update:args', { ...this.args, recipients });
        },
        setSubject(subject) {
            this.$emit('update:args', { ...this.args, subject });
        },
        setContent(content) {
            this.$emit('update:args', { ...this.args, content });
        },
    },
};
</script>
