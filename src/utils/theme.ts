export function switchTheme() {
  let theme = getCurrentTheme();
  setTheme(theme === 'light'? 'dark' : 'light')

}

function setTheme(theme: "dark" | "light"): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('data-theme', theme);
}

function getCurrentTheme(): 'light' | 'dark' {
  return localStorage.getItem('data-theme') as 'light' || 'dark';
}

export function setCurrentTheme() {
  setTheme(getCurrentTheme());
}
