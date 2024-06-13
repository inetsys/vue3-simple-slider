<template>
    <div class="slider" :class="containerClasses">
        <div ref="sliderEl" />
    </div>
</template>

<script>
import { ref, onMounted, watch, watchEffect, computed } from 'vue'
import nouislider from 'nouislider'

function isNumeric(property) {
    return Number(property) === property
}
function getNumberOfDecimals(value) {
    return (('' + value).split('.')[1] || '').length
}
function directionIsValid(direction) {
    return ['rtl', 'ltr'].indexOf(direction) > -1
}
function layoutIsValid(layout) {
    return ['horizontal', 'vertical'].indexOf(layout) > -1
}

function buildOptionFormat(definition) {
    let decimals = Math.max(getNumberOfDecimals(definition.min), getNumberOfDecimals(definition.max))
    if (isNumeric(definition.step)) {
        decimals = Math.max(decimals, getNumberOfDecimals(definition.step))
    }
    else {
        decimals = Math.max(decimals, 3)
    }
    const formatterMethod = function(value) {
        return '' + Number(value.toFixed(decimals))
    }

    return {
        format: {
            to: formatterMethod,
            from(value) { // String
                return Number(value)
            },
        },
    }
}
function buildOptionStep(definition) {
    return {
        step: isNumeric(definition.step) ? definition.step : null,
    }
}
function buildOptionTooltip(definition) {
    const tooltipFormatter = definition.format
        ? { to: definition.format }
        : true

    return {
        tooltips: definition.showValue && definition.modelValue !== null ? tooltipFormatter : false,
    }
}
function buildOptionsLayout(definition) {
    return {
        orientation: definition.layout,
        direction: definition.layout === 'vertical' ? 'rtl' : definition.direction,
    }
}

function toggleDisabled(element, disable) {
    if (disable) {
        element.setAttribute('disabled', true)
    }
    else if (element.hasAttribute('disabled')) {
        element.removeAttribute('disabled')
    }
}

function updateFormat(slider, definition) {
    slider.updateOptions(buildOptionFormat(definition))
}
function updateStep(slider, definition) {
    slider.updateOptions(buildOptionStep(definition))
}
function updateTooltip(slider, definition) {
    slider.updateOptions(buildOptionTooltip(definition))
}

function normalizeValue(slider) {
    return slider.modelValue !== null
        ? slider.modelValue
        : slider.min + (slider.max - slider.min) / 2
}

function createSlider(element, definition, context) {
    const sliderOptions = {
        // cssPrefix: 'slider--',
        start: normalizeValue(definition),
        range: {
            min: definition.min,
            max: definition.max,
        },
        connect: [true, true],
        ...buildOptionsLayout(definition),
        ...buildOptionStep(definition),
        ...buildOptionFormat(definition),
        ...buildOptionTooltip(definition),
    }

    const slider = nouislider.create(element, sliderOptions)
    slider.on('change', values => {  /* values, handle, unencoded, tap, positions, noUiSlider */
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
    name: 'SimpleSlider',
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
        format: {
            type: Function,
            default: null,
        },
        direction: {
            type: String,
            default: 'ltr',
            validator: value => directionIsValid(value),
        },
        layout: {
            type: String,
            default: 'horizontal',
            validator: value => layoutIsValid(value),
        },
    },
    setup(props, context) {
        const sliderEl = ref(null)
        const slider = ref(null)

        onMounted(() => {
            slider.value = createSlider(sliderEl.value, props, context)

            watch(() => props.disabled, newValue => toggleDisabled(slider.value.target, newValue), {
                immediate: true,
            })
            watch(() => props.modelValue, newValue => {
                if (slider.value.get() !== newValue) {
                    slider.value.set(normalizeValue(props))
                }
            })
            watch(() => props.direction, newValue => {
                if (directionIsValid(newValue)) {
                    slider.value = recreateSlider(slider.value, sliderEl.value, props, context)
                }
            })
            watch(() => props.layout, newValue => {
                if (layoutIsValid(newValue)) {
                    slider.value = recreateSlider(slider.value, sliderEl.value, props, context)
                }
            })
            watchEffect(() => updateTooltip(slider.value, props))
            watchEffect(() => updateFormat(slider.value, props))
            watchEffect(() => updateStep(slider.value, props))
        })

        const containerClasses = computed(() => {
            const classes = []
            props.disabled && classes.push('slider--disabled')
            props.showValue && classes.push('slider--shown-value')
            props.min === props.modelValue && classes.push('slider--min')
            props.max === props.modelValue && classes.push('slider--max')
            props.modelValue === null && classes.push('slider--empty')
            classes.push(`slider--layout-${props.layout}`)

            return classes
        })

        return { sliderEl, slider, containerClasses }
    },
}
</script>

<style lang="less">
// Based on nouislider styles 15.8.0
.slider {
    --slider-border-color: #D9D9D9;
    --slider-connect-background-color: #3FB8AF;
    --slider-connect-border-radius: 3px;
    --slider-handle-background-color: white;
    --slider-disabled-background-color: #B8B8B8;
    --slider-handle-width: 25px;
    --slider-handle-height: 20px;
    --slider-handle-border-radius: 3px;
    --slider-vertical-size: 400px;
    --slider-bar-width: 10px;

    &--layout {
        &-vertical {
            height: var(--slider-vertical-size);
        }
    }

    .noUi {
        &-target,
        &-target * {
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
        &-target {
            position: relative;
        }

        &-base,
        &-connects {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
        }
        &-connects {
            overflow: hidden;
            z-index: 0;
        }
        &-connect,
        &-origin {
            will-change: transform;
            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
            height: 100%;
            width: 100%;
            -ms-transform-origin: 0 0;
            -webkit-transform-origin: 0 0;
            -webkit-transform-style: preserve-3d;
            transform-origin: 0 0;
            transform-style: flat;
        }
        // Offset direction
        &-txt-dir-rtl {
            .noUi-horizontal {
                .noUi-origin {
                    left: 0;
                    right: auto;
                }
                .noUi-handle {
                    // left: -17px;
                    right: auto;
                }
            }
        }
        // Give origins 0 height/width so they don't interfere with clicking the connect elements.
        &-vertical {
            width: var(--slider-bar-width);
            height: 100%;

            .noUi-origin {
                top: calc(-100% + 1.5 * var(--slider-handle-width));
                height: calc(100% - var(--slider-handle-width));
                left: 50%;
                width: 0;
            }
            .noUi-handle {
                height: var(--slider-handle-width);
                width: var(--slider-handle-height);
                transform: translate(50%, 50%);
                bottom: 0;
            }
            .noUi-tooltip {
                -webkit-transform: translate(0, -50%);
                transform: translate(0, -50%);
                top: 50%;
                left: 120%;
            }
        }
        &-horizontal {
            height: var(--slider-bar-width);

            .noUi-origin {
                width: auto;
                height: 0;
                top: 50%;
                left: calc(var(--slider-handle-width) / 2);
                right: calc(var(--slider-handle-width) / 2);
            }
            .noUi-handle {
                width: var(--slider-handle-width);
                height: var(--slider-handle-height);
                transform: translate(50%, -50%);
                top: 0;
            }
            .noUi-tooltip {
                -webkit-transform: translate(-50%, 0);
                transform: translate(-50%, 0);
                left: 50%;
                bottom: 120%;
            }
        }

        &-handle {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            position: absolute;
            right: 0;

            cursor: grab;
            border: 1px solid var(--slider-border-color);
            border-radius: var(--slider-handle-border-radius);
            background-color: var(--slider-handle-background-color);
            box-shadow: 0 3px 6px -3px silver;

            &.noUi-active {
                cursor: grabbing;
            }
        }

        &-touch-area {
            height: 100%;
            width: 100%;
        }

        &-state-tap {
            .noUi-connect,
            .noUi-origin {
                -webkit-transition: transform 0.3s;
                transition: transform 0.3s;
            }
        }

        &-state-drag * {
            cursor: inherit !important;
        }

        &-target {
            background: var(--slider-handle-background-color);
            border-radius: calc(var(--slider-connect-border-radius) + 1px);
            border: 1px solid var(--slider-border-color);
        }

        &-connects {
            border-radius: var(--slider-connect-border-radius);
        }
        &-connect {
            background: var(--slider-connect-background-color);
        }

        &-tooltip {
            display: block;
            position: absolute;
            border: 1px solid var(--slider-border-color);
            border-radius: var(--slider-handle-border-radius);
            background: var(--slider-handle-background-color);
            padding: 3px 5px;
            text-align: center;
            white-space: nowrap;
        }
    }

    &--disabled {
        .noUi {
            &-connect {
                background: var(--slider-disabled-background-color);
            }
            &-target,
            &-handle {
                cursor: not-allowed;
            }
        }
    }
}</style>
