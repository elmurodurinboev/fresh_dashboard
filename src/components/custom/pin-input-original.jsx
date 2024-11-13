import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PinInputOg = ({
                      containerClassName,
                      id,
                      className,
                      type = 'alphanumeric',
                      placeholder = '○',
                      length = 4,
                      name,
                      form,
                      defaultValue,
                      value,
                      onChange,
                      onComplete,
                      mask = false,
                      otp = false,
                      disabled = false,
                      readOnly = false,
                      autoFocus = false,
                      ariaLabel,
                    }) => {
  if (length < 1 || length > 12) {
    throw new Error('input length cannot be more than 12 or less than 1')
  }

  if ((value !== undefined && !onChange) || (value === undefined && onChange)) {
    throw new Error(
      'if one of value or onChange is specified, both props must be set.'
    )
  }

  const { pins, pinValue, refMap, ...handlers } = usePinInput({
    value,
    defaultValue,
    placeholder,
    type,
    length,
    readOnly,
  })

  React.useEffect(() => {
    onChange && onChange(pinValue)
  }, [onChange, pinValue])

  React.useEffect(() => {
    if (onComplete && pinValue.length === length) {
      onComplete(pinValue)
    }
  }, [length, onComplete, pinValue])

  React.useEffect(() => {
    if (!autoFocus) return
    const node = refMap?.get(0)
    if (node) {
      node.focus()
    }
  }, [autoFocus, refMap])

  return (
    <div className={cn('flex gap-2', containerClassName)}>
      {pins.map((pin, i) => (
        <PinInputField
          key={i}
          id={i === 0 ? id : undefined}
          defaultValue={pin}
          onChange={(e) => handlers.handleChange(e, i)}
          onFocus={(e) => handlers.handleFocus(e, i)}
          onBlur={() => handlers.handleBlur(i)}
          onKeyDown={(e) => handlers.handleKeyDown(e, i)}
          onPaste={handlers.handlePaste}
          placeholder={placeholder}
          className={className}
          type={type}
          mask={mask}
          autoComplete={otp ? 'one-time-code' : 'off'}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel}
          ref={(node) => {
            if (node) {
              refMap?.set(i, node)
            } else {
              refMap?.delete(i)
            }
          }}
        />
      ))}
      <input type='hidden' name={name} form={form} value={pinValue} />
    </div>
  )
}
PinInputOg.displayName = 'PinInputOg'

const PinInputField = React.forwardRef(({ className, type, mask, ...props }, ref) => {
  const inputType = mask ? 'password' : type === 'numeric' ? 'tel' : 'text'
  return (
    <Input
      ref={ref}
      type={inputType}
      inputMode={type === 'numeric' ? 'numeric' : 'text'}
      className={cn('size-10 text-center', className)}
      {...props}
    />
  )
})

const usePinInput = ({
                       value,
                       defaultValue,
                       placeholder,
                       type,
                       length,
                       readOnly,
                     }) => {
  const pinInputs = Array.from({ length }, (_, index) =>
    defaultValue ? defaultValue.charAt(index) : value ? value.charAt(index) : ''
  )
  const [pins, setPins] = React.useState(pinInputs)
  const pinValue = pins.join('').trim()

  const itemsRef = React.useRef(null)

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map()
    }
    return itemsRef.current
  }

  function getNode(index) {
    const map = getMap()
    return map?.get(index)
  }

  function focusInput(itemId) {
    const node = getNode(itemId)
    if (node) {
      node.focus()
      node.placeholder = ''
    }
  }

  function handleFocus(event, index) {
    event.target.select()
    focusInput(index)
  }

  function handleBlur(index) {
    const node = getNode(index)
    if (node) {
      node.placeholder = placeholder
    }
  }

  function updateInputField(val, index) {
    const node = getNode(index)
    if (node) {
      node.value = val
    }

    setPins((prev) =>
      prev.map((p, i) => (i === index ? val : p))
    )
  }

  function validate(value) {
    const NUMERIC_REGEX = /^[0-9]+$/
    const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i
    const regex = type === 'alphanumeric' ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX
    return regex.test(value)
  }

  const pastedVal = React.useRef(null)

  function handleChange(e, index) {
    const inputValue = e.target.value
    const pastedValue = pastedVal.current
    const inputChar = pastedValue
      ? pastedValue.charAt(length - 1)
      : inputValue.slice(-1)

    if (validate(inputChar)) {
      updateInputField(inputChar, index)
      pastedVal.current = null
      if (inputValue.length > 0) {
        focusInput(index + 1)
      }
    }
  }

  function handlePaste(event) {
    event.preventDefault()
    const copyValue = event.clipboardData
      .getData('text/plain')
      .replace(/[\n\r\s]+/g, '')
    const copyArr = copyValue.split('').slice(0, length)

    if (!copyArr.every((c) => validate(c))) return

    copyArr.forEach((c, i) => updateInputField(c, i))

    pastedVal.current = copyValue
    focusInput(copyArr.length < length ? copyArr.length : length - 1)
  }

  function handleKeyDown(event, index) {
    const { ctrlKey, key, shiftKey, metaKey } = event

    if (type === 'numeric' && !ctrlKey && !metaKey && isNaN(key)) {
      event.preventDefault()
    }

    if (['ArrowLeft', 'Tab', 'Backspace', 'Delete'].includes(key)) {
      if (key === 'ArrowLeft' || (shiftKey && key === 'Tab')) {
        focusInput(index - 1)
      } else if (key === 'ArrowRight' || key === 'Tab') {
        focusInput(index + 1)
      } else if (key === 'Backspace') {
        updateInputField('', index)
        focusInput(index - 1)
      }
      event.preventDefault()
    }
  }

  return {
    pins,
    pinValue,
    refMap: getMap(),
    handleFocus,
    handleBlur,
    handleChange,
    handlePaste,
    handleKeyDown,
  }
}

export { PinInputOg }
