// utils/withSnackbar.js
import i18n from '@/utils/Translation/i18n.js'

/**
 * Wrap a promise and surface i18n’d snackbars for success/error.
 * @param {Promise} promise
 * @param {Object} options
 * @returns {Promise<{response:any, error:string|null}>}
 */
export const withSnackbar = async (promise, options = {}) => {
  const [{ useSnackbarStore }, { useUserStore }] = await Promise.all([
    import('@/stores/snackbar.js'),
    import('@/stores/user.js'),
  ])

  const {
    successText,
    errorText,
    onSuccess,
    onError,
    showSuccess = true,
    showError = true,
    fallbackSuccess = 'operation_succeeded',
    fallbackError = 'network_or_server_error',
    errorKey = 'message',
    successKey = 'message',

    // NEW: don’t surface handler errors as “network” errors unless you want to
    treatHandlerErrorsAsFailures = false,
    handlerErrorText = 'unexpected_client_error',
  } = options

  const snackStore = useSnackbarStore()
  const userStore = useUserStore()
  const $t = i18n.global.t
  const $te = i18n.global.te?.bind(i18n.global) || (() => false)

  const local = i18n.global.locale?.value || 'en'

  const safeT = (maybeKeyOrText) =>
    typeof maybeKeyOrText === 'string' && maybeKeyOrText.trim().length
      ? $te(maybeKeyOrText)
        ? $t(maybeKeyOrText)
        : maybeKeyOrText
      : ''

  const extractError = (err) => {
    const data = err?.response?.data
    const candidates = [
      data?.[errorKey],
      data?.error,
      data?.errors?.[0]?.msg,
      data?.errors?.[0]?.message,
      typeof data === 'string' ? data : undefined,
      err?.response?.statusText,
      err?.message,
    ]
    return (
      candidates.find((v) => typeof v === 'string' && v.trim().length) || ''
    )
  }

  const extractSuccess = (res) => {
    const d = res?.data
    const candidates = [
      typeof successText === 'function' ? successText(res) : successText,
      d?.[successKey],
      typeof d === 'string' ? d : undefined,
      fallbackSuccess,
    ]
    return (
      candidates.find((v) => typeof v === 'string' && v.trim().length) ||
      fallbackSuccess
    )
  }

  let response
  try {
    response = await promise
  } catch (error) {
    // === TRUE API/NETWORK FAILURE PATH ===
    if (error?.response?.data?.message === 'Invalid credentials!!!') {
      userStore.LOGOUT(true)
    }

    // Make the console log safe
    try {
      console.log('error', error?.response?.data ?? error)
    } catch (_) {}

    let resolvedError =
      (typeof errorText === 'function' ? errorText(error) : errorText) ||
      extractError(error) ||
      fallbackError

    if (showError && resolvedError) {
      snackStore.DISPLAY_SNACK({ text: safeT(resolvedError), type: 'warning' })
    }

    if (typeof onError === 'function') {
      try {
        onError(error)
      } catch (_) {}
    }

    return { response: null, error: resolvedError }
  }

  // === SUCCESS PATH ===
  const msg = extractSuccess(response)
  if (showSuccess && msg) {
    snackStore.DISPLAY_SNACK({ text: safeT(msg), type: 'success' })
  }

  // Run handler but isolate its failures so they don't look like network errors
  if (typeof onSuccess === 'function') {
    try {
      await onSuccess(response)
    } catch (handlerErr) {
      console.error('onSuccess handler error:', handlerErr)
      if (treatHandlerErrorsAsFailures) {
        const text =
          (typeof errorText === 'function'
            ? errorText(handlerErr)
            : errorText) ||
          safeT(handlerErr?.message) ||
          handlerErrorText
        if (showError && text) {
          snackStore.DISPLAY_SNACK({ text: safeT(text), type: 'warning' })
        }
        return { response, error: text } // keep response so caller can still use it
      }
      // Otherwise, we don’t surface a network/server error; we just return both.
      return { response, error: handlerErr }
    }
  }

  return { response, error: null }
}
