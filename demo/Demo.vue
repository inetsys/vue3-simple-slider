<template>
    <section>
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
    </section>

    <section>
        <h2>2.- Numeric values</h2>
        <slider
            v-model.number="example02.value"
            :min="example02.min"
            :max="example02.max"
        />
        <pre>Value: {{ example02.value }} ({{ typeof example02.value }})</pre>
    </section>

    <section>
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
    </section>

    <section>
        <h2>4.- Step</h2>
        <slider
            v-model.number="example04.value"
            :min="example04.min"
            :max="example04.max"
            :step="example04.step"
        />
        <pre>Value: {{ example04.value }}</pre>
    </section>

    <section>
        <h2>5.- Tooltip</h2>
        <slider
            v-model="example05.value"
            :min="example05.min"
            :max="example05.max"
            :show-value="example05.tooltip"
            :format="example05.customFormat ? example05FormatMethod : null"
        />
        <div>
            <label>
                <input type="checkbox" v-model="example05.tooltip"> Show tooltip
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" v-model="example05.customFormat" :disabled="!example05.tooltip"> Custom format
            </label>
        </div>
        <pre>Value: {{ example05.value }}</pre>
    </section>

    <section>
        <h2>6.- Language direction - right to left</h2>
        <slider
            v-model="example06.value"
            :min="example06.min"
            :max="example06.max"
            :direction="example06.direction"
            show-value
        />
        <div>
            <label>
                <input type="radio"
                    value="ltr"
                    v-model="example06.direction"
                    name="example06direction"
                >
                Left to right
            </label>
            <label>
                <input type="radio"
                    value="rtl"
                    v-model="example06.direction"
                    name="example06direction"
                >
                Right to left
            </label>
        </div>
        <pre>Value: {{ example06.value }}</pre>
    </section>
</template>

<script>
import Slider from '@/main.js'

export default {
    name: 'Demo',
    components: {
        Slider,
    },
    setup() {
        return {
            example05FormatMethod(value) {
                return 'Price: ' + value.toFixed(2) + '€'
            },
        }
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
                tooltip: true,
                customFormat: false,
            },
            example06: {
                value: 0,
                min: 0,
                max: 10,
                step: 1,
                direction: 'rtl',
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
