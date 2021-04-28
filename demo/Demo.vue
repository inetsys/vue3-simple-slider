<template>
    <section>
        <h2>1.- Simple use</h2>
        <slider
            v-model="example01.value"
            :min="example01.min"
            :max="example01.max"
            :disabled="example01.disabled"
            :step="example01.stepEnabled ? example01.step : null"
            :show-value="example01.tooltip"
            :format="example01.customFormat ? customFormatter : null"
            :direction="example01.direction"
        />
        <div class="options">
            <div>
                <button type="button" @click="example01.value = '5'">Set 5</button>
            </div>
            <div>
                <label>
                    <input type="checkbox" v-model="example01.disabled"> Disable
                </label>
            </div>
            <div>
                <label>
                    <button type="button" @click="example01.value = null">Empty</button>
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" v-model="example01.tooltip"> Show tooltip
                </label>
                <label>
                    <input type="checkbox" v-model="example01.customFormat" :disabled="!example01.tooltip"> Custom format
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" v-model="example01.stepEnabled"> Set step
                </label>

                <input type="number" v-model.number="example01.step" :disabled="!example01.stepEnabled">
            </div>
            <div>
                <label>
                    <input type="radio"
                        value="ltr"
                        v-model="example01.direction"
                        name="example01direction"
                    >
                    Left to right
                </label>
                <label>
                    <input type="radio"
                        value="rtl"
                        v-model="example01.direction"
                        name="example01direction"
                    >
                    Right to left
                </label>
            </div>
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
            customFormatter(value) {
                return 'Price: ' + value.toFixed(2) + '€'
            },
        }
    },
    data() {
        return {
            example01: {
                value: null,
                min: 0,
                max: 10,
                disabled: false,
                stepEnabled: false,
                step: 1,
                tooltip: true,
                customFormat: false,
                direction: 'ltr',
            },
            example02: {
                value: null,
                min: 0,
                max: 100,
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

section {
    + section {
        margin-top: 40px;
        border-top: 1px solid silver;
        padding-top: 20px;
    }
}

h2 {
    margin-bottom: 40px;
}

.options {
    div {
        margin-top: 10px;
    }
}
</style>
