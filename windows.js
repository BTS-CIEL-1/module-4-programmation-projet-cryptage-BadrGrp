document.getElementById('minimize').addEventListener('click', () => {
  window.electronAPI.minimize();
});

document.getElementById('close').addEventListener('click', () => {
  window.electronAPI.close();
});