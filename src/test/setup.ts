import '@testing-library/jest-dom/vitest'

// jsdom has no layout engine: ResizeObserver doesn't exist as a global, and every element's
// offsetWidth/offsetHeight/getBoundingClientRect reads 0. @tanstack/react-virtual (used by the
// affix Combobox) measures its scroll container's size via element.offsetHeight/offsetWidth
// specifically (see @tanstack/virtual-core's getRect helper) — a zero reading means it always
// computes an empty visible range, so every test would see zero rendered rows. The RO
// constructor still needs to exist (real code calls `new ResizeObserver(...)`) even though our
// tests never need it to actually fire; the initial synchronous offsetHeight/offsetWidth read is
// what the virtualizer's first measurement actually depends on.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverMock

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 300 })
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 300 })

// jsdom has never implemented <dialog>'s imperative methods (showModal/close), only the `open`
// attribute reflection — see https://github.com/jsdom/jsdom/issues/3294. GlobalAffixPoolDialog
// drives visibility purely through these two methods, so tests need a minimal stand-in: toggle
// the `open` attribute and fire the same 'close' event real browsers fire on close().
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.open) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
