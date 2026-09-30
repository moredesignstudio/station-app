import { getUrlToLoad } from '../../utils/dev';
import { isDarwin } from '../../utils/process';
import { getResourceIconPath } from '../../utils/resources';
// @ts-ignore: no declaration file
import { windowCreated } from '../duck';
import GenericWindowManager from './GenericWindowManager';
import services from '../../services/servicesManager';

export default class MainWindowManager extends GenericWindowManager {

  static instance: MainWindowManager;
  static FILEPATH = getUrlToLoad('main.html');

  constructor() {
    super();
    MainWindowManager.instance = this;
  }

  async create() {
    if (this.isCreated()) {
      return this.window;
    }

    // macOS: the native traffic lights sit inside our own top bar (top-bar/TopBar.tsx)
    const macTitleBar: Partial<Electron.BrowserWindowConstructorOptions> = isDarwin
      ? { titleBarStyle: 'hidden', trafficLightPosition: { x: 16, y: 13 } }
      : {};

    await super.create({
      show: false,
      ...macTitleBar,
      icon: getResourceIconPath(),
      acceptFirstMouse: true,
      savePosition: 'main-window',
    });

    this.on('minimize', async () => {
      const trayIconVisible = await services.electronApp.trayIconVisible()
      if (trayIconVisible) {
        services.browserWindow.hideAllWindows();
      }
    });

    await super.load();

    return this.window!;
  }

  // @overdide
  initDispatch() {
    MainWindowManager.dispatch(windowCreated(this.windowId, true));
  }
}
