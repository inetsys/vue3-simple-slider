<template>
    <div class="slider" :class="containerClasses">
        <div ref="sliderEl" />
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import nouislider from 'nouislider'

function directionIsValid(direction) {
    return ['rtl', 'ltr'].indexOf(direction) > -1
}

function toggleDisabled(element, disable) {
    if (disable) {
        element.setAttribute('disabled', true)
    }
    else if (element.hasAttribute('disabled')) {
        element.removeAttribute('disabled')
    }
}

function createSlider(element, definition, context) {
    const initialValue = definition.modelValue !== null ? definition.modelValue : definition.min
    if (definition.modelValue === null) {
        context.emit('update:modelValue', initialValue.toFixed(2))
    }

    const sliderOptions = {
        cssPrefix: 'slider--',
        start: initialValue,
        range: {
            min: definition.min,
            max: definition.max,
        },
        connect: [true, true],
        tooltips: definition.showValue,
        direction: definition.direction,
    }
    if (definition.step !== null) {
        sliderOptions.step = definition.step
    }

    const slider = nouislider.create(element, sliderOptions)
    slider.on('change', function(values, handle, unencoded, tap, positions, noUiSlider) {
        context.emit('update:modelValue', values[0])
    })

    return slider
}

function recreateSlider(slider, element, definition, context) {
    slider.destroy()
    slider = createSlider(element, definition, context)

    return slider
}

export default {
    inheritAttrs: false,
    props: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        step: {
            type: Number,
            default: null,
        },
        modelValue: {
            type: [String, Number],
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        showValue: {
            type: Boolean,
            default: false,
        },
        direction: {
            type: String,
            default: 'ltr',
            validator(value) {
                return directionIsValid(value)
            },
        },
    },
    setup(props, context) {
        const sliderEl = ref(null)
        const slider = ref(null)

        onMounted(() => {
            slider.value = createSlider(sliderEl.value, props, context)

            watch(() => props.disabled, (newValue) => toggleDisabled(slider.value.target, newValue), {
                immediate: true,
            })
            watch(() => props.modelValue, newValue => {
                if (slider.value.get() !== newValue) {
                    slider.value.set(newValue)
                }
            })
            watch(() => props.direction, newValue => {
                if (directionIsValid(newValue)) {
                    slider.value = recreateSlider(slider.value, sliderEl.value, props, context)
                }
            })
        })

        const containerClasses = computed(() => {
            const classes = []
            props.disabled && classes.push('slider--disabled')
            props.showValue && classes.push('slider--shown-value')
            props.min === props.modelValue && classes.push('slider--min')
            props.max === props.modelValue && classes.push('slider--max')

            return classes
        })

        return { sliderEl, slider, containerClasses }
    },
}
</script>

<style lang="less">
// Based on nouislider styles - 14.6.3

// Sizes
@sliderHeight: 20px;
@sliderHandleSize: 30px;
// Colors
@sliderBackgroundColor: #FAFAFA;
@sliderBorderColor: #D9D9D9;
@sliderConnectBackgroundColor: #3FB8AF;
@sliderHandleBackgroundColor: white;
@sliderDisabledBackgroundColor: #B8B8B8;

.slider {
    /* Functional styling;
     * These styles are required for noUiSlider to function.
     * You don't need to change these rules to apply your design.
     */
    &--target,
    &--target * {
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-user-select: none;
        -ms-touch-action: none;
        touch-action: none;
        -ms-user-select: none;
        -moz-user-select: none;
        user-select: none;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    &--target {
        position: relative;
    }
    &--base,
    &--connects {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    /* Wrapper for all connect elements.
    */
    &--connects {
        overflow: hidden;
        z-index: 0;
    }
    &--connect,
    &--origin {
        will-change: transform;
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        -ms-transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
        -webkit-transform-style: preserve-3d;
        transform-origin: 0 0;
        transform-style: flat;
    }
    &--connect {
        height: 100%;
        width: 100%;
    }
    &--origin {
        height: 10%;
        width: 10%;
    }

    /* Give origins 0 height/width so they don't interfere with clicking the
    * connect elements.
    */
    &--horizontal &--origin {
        height: 0;
    }
    &--handle {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        position: absolute;
    }
    &--touch-area {
        height: 100%;
        width: 100%;
    }
    &--state-tap &--connect,
    &--state-tap &--origin {
        -webkit-transition: transform 0.3s;
        transition: transform 0.3s;
    }
    &--state-drag * {
        cursor: inherit !important;
    }

    /* Styling;
    * Giving the connect element a border radius causes issues with using transform: scale
    */
    &--target {
        height: @sliderHeight;
        background: @sliderBackgroundColor;
        border-radius: 4px;
        border: 1px solid #D3D3D3;
    }
    &--connects {
        border-radius: 3px;
    }
    &--connect {
        background: @sliderConnectBackgroundColor;
    }

    &--handle {
        width: @sliderHandleSize;
        height: @sliderHandleSize;
        right: -@sliderHandleSize / 2;
        top: -(@sliderHandleSize - @sliderHeight) / 2;
        border: 1px solid @sliderBorderColor;
        border-radius: @sliderHandleSize / 2;
        background: @sliderHandleBackgroundColor;
        cursor: e-resize;

        &:focus {
            box-shadow: 0 0 0 1px black;
            outline: none;
        }
    }

    &--tooltip {
        display: block;
        position: absolute;
        border: 1px solid @sliderBorderColor;
        border-radius: 3px;
        padding: 5px;
        text-align: center;
        white-space: nowrap;
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        left: 50%;
        bottom: 120%;
    }

    [disabled] &--connect {
        background: @sliderDisabledBackgroundColor;
    }
    [disabled]&--target,
    [disabled]&--handle,
    [disabled] &--handle {
        cursor: not-allowed;
    }
}
</style>
