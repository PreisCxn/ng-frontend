import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

function toggleDarkMode() {
  const root = document.documentElement;
  const darkMode = root.style.getPropertyValue('--dark-mode');
  if (darkMode === 'true') {
    root.style.setProperty('--dark-mode', 'false');
  } else {
    root.style.setProperty('--dark-mode', 'true');
  }
}
