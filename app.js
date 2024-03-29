console.log(
  `%chttps://omareloui.com %c${new Date().getFullYear()}`,
  "color: #f5f5f5; background: #121212; padding: 5px 10px; font-size: 16px; margin: 10px 0; border-radius: 4px 0 0 4px",
  "color: #121212; background: #f5f5f5; padding: 5px 10px; font-size: 16px; margin: 10px 0; border-radius: 0 4px 4px 0"
)

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js")

/* Control themes */
const LIGHT_THEME = "light"
const DARK_THEME = "dark"
function toggleTheme() {
  document.documentElement.hasAttribute("theme")
    ? activateLightTheme()
    : activateDarkTheme()
}
function getThemeIconElement() {
  return document.querySelector(".navbar__theme-icon")
}
function activateDarkTheme() {
  getThemeIconElement().src = "/icons/light-theme.svg"
  document.documentElement.setAttribute("theme", "dark")
  saveTheme(DARK_THEME)
}
function activateLightTheme() {
  getThemeIconElement().src = "/icons/dark-theme.svg"
  document.documentElement.removeAttribute("theme")
  saveTheme(LIGHT_THEME)
}
function saveTheme(theme) {
  localStorage.setItem("theme", theme)
}
;(function activatedSavedTheme() {
  localStorage.getItem("theme") === DARK_THEME
    ? activateDarkTheme()
    : activateLightTheme()
})()

/* Color generator */
const savedColors = []

function getHexValues() {
  return [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ]
}
/* Generate random color */
function getHexPreviewSpan() {
  return document.querySelector(".color-container__hexcode")
}
function getPreviewedHexValue() {
  return getHexPreviewSpan().innerHTML
}
function getPreviewColorDiv() {
  return document.querySelector(".color-container__preview")
}
function randomIndexForHex() {
  return Math.floor(Math.random() * Math.floor(getHexValues().length))
}
function randomHexNumber() {
  return getHexValues()[randomIndexForHex()]
}
function generateColor() {
  let color = ""
  for (let i = 0; i < 6; i++) color += randomHexNumber()
  color = `#${color.toUpperCase()}`
  saveColor(color)
  previewColor(color)
}
function saveColor(color) {
  savedColors.push(color)
}
function previewColor(color) {
  getHexPreviewSpan().innerHTML = color
  getPreviewColorDiv().style.background = color
}

/* Get last color */
function removeLastSavedColor() {
  if (savedColors.length === 1) return notify("First color!")
  savedColors.pop()
}
function showPreviousColor() {
  removeLastSavedColor()
  previewColor(savedColors[savedColors.length - 1])
}

/* Copy hexcode */
function createElement(element) {
  return document.createElement(element)
}
function copy(element) {
  element.select()
  document.execCommand("copy")
}
function appendToBody(element) {
  document.body.appendChild(element)
}
function removeElement(element) {
  document.body.removeChild(element)
}
function copyHexcodeToClipboard() {
  const elementToCopy = createElement("textarea")
  elementToCopy.value = getPreviewedHexValue()
  appendToBody(elementToCopy)
  copy(elementToCopy)
  removeElement(elementToCopy)
  notify("Copied!")
}

/* Notification */
function getNotificationElement() {
  return document.querySelector(".notification")
}
function addMessageToNotification(message) {
  const notificationElement = getNotificationElement()
  notificationElement.innerHTML = message
}
function isNotificationShown() {
  return getNotificationElement().classList.contains("notification--show")
}
function showNotification() {
  const notificationElement = getNotificationElement()
  !isNotificationShown() &&
    notificationElement.classList.add("notification--show")
}
function hideNotification() {
  const notificationElement = getNotificationElement()
  isNotificationShown() &&
    notificationElement.classList.remove("notification--show")
}
function notify(message) {
  // Check first if there's notification taking place
  if (isNotificationShown()) return
  addMessageToNotification(message)
  setTimeout(showNotification, 100)
  setTimeout(hideNotification, 1100)
}

/* Start the app with random color and listen to the space key */
;(function generateColorOnPageLoad() {
  generateColor()
})()
;(function generateColorOnSpaceKeyUp() {
  document.addEventListener("keyup", (e) => {
    if (e.code !== "Space") return
    // check if the focused element a button other than the generate button
    const clickTagName = e.target.tagName
    if (clickTagName.match(/button/gi)) {
      if (!e.target.classList.contains("color-container__button--generate"))
        return
    }
    generateColor()
  })
})()
