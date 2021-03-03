<template>
    <h2>1.- Simple use</h2>
    <slider
        v-model="example01.value"
        :min="example01.min"
        :max="example01.max"
    />
    <div>
        <button type="button" @click="example01.value = '50'">Set 50</button>
    </div>
    <pre>Value: {{ example01.value }} ({{ typeof example01.value }})</pre>

    <h2>2.- Numeric values</h2>
    <slider
        v-model.number="example02.value"
        :min="example02.min"
        :max="example02.max"
    />
    <pre>Value: {{ example02.value }} ({{ typeof example02.value }})</pre>

    <h2>3.- Disable slider</h2>
    <slider
        v-model="example03.value"
        :min="example03.min"
        :max="example03.max"
        :disabled="example03.disabled"
    />
    <div>
        <label>
            <input type="checkbox" v-model="example03.disabled">
            Disable
        </label>
    </div>
    <pre>Value: {{ example03.value }}</pre>

    <h2>4.- Step</h2>
    <slider
        v-model.number="example04.value"
        :min="example04.min"
        :max="example04.max"
        :step="example04.step"
    />
    <pre>Value: {{ example04.value }}</pre>

    <h2>5.- Tooltip</h2>
    <slider
        v-model="example05.value"
        :min="example05.min"
        :max="example05.max"
        show-value
    />
    <pre>Value: {{ example05.value }}</pre>
</template>

<script>
import Slider from '@/main.js'

export default {
    name: 'Demo',
    components: {
        Slider,
    },
    data() {
        return {
            example01: {
                value: null,
                min: 0,
                max: 100,
            },
            example02: {
                value: null,
                min: 0,
                max: 100,
            },
            example03: {
                value: 25,
                min: 0,
                max: 100,
                disabled: true,
            },
            example04: {
                value: 3,
                min: 0,
                max: 10,
                step: 1,
            },
            example05: {
                value: 5,
                min: 0,
                max: 10,
                step: 1,
            },
        }
    },
}
</script>

<style lang="less">
#demo {
    > * {
        width: 600px;
        max-width: 95%;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>
