import { Log, isClient } from "@utils";
import { InfoIcon } from "@icons";
import { WorkboxWindow } from "@types";

import { NotalUIContextProps } from "@hooks/useNotalUI";

import { Button } from "@components";

export function WorkboxInit(NotalUI: NotalUIContextProps) {
  if (!isClient()) return;

  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    window.workbox !== undefined
  ) {
    const wb = window.workbox;
    // add event listeners to handle any of PWA lifecycle event
    // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
    wb.addEventListener("installed", (event: WorkboxWindow.IWorkboxEvent) => {
      Log.debug(`Event ${event.type} is triggered.`);
      Log.debug(event);
    });

    wb.addEventListener("controlling", (event: WorkboxWindow.IWorkboxEvent) => {
      Log.debug(`Event ${event.type} is triggered.`);
      Log.debug(event);
    });

    wb.addEventListener("activated", (event: WorkboxWindow.IWorkboxEvent) => {
      Log.debug(`Event ${event.type} is triggered.`);
      Log.debug(event);
    });

    // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
    // NOTE: MUST set skipWaiting to false in next.config.js pwa object
    // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
    const promptNewVersionAvailable = (event: WorkboxWindow.WorkboxEvent) => {
      // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
      // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
      // You may want to customize the UI prompt accordingly.
      if (event.wasWaitingBeforeRegister) {
        NotalUI.Toast.show({
          title: "An update is available",
          desc: "A new version of Notal is available. Refresh to use latest version.",
          icon: <InfoIcon size={24} fill="currentColor" />,
          className: "dark:bg-yellow-600 bg-yellow-500 text-white",
          timeEnabled: false,
          buttons: (index) => {
            return [
              <Button
                className="p-1 px-2 rounded hover:opacity-70"
                onClick={() => {
                  NotalUI.Toast.close(index);
                  /*
                   */
                  wb.addEventListener(
                    "controlling",
                    (event: WorkboxWindow.IWorkboxEvent) => {
                      window.location.reload();
                    }
                  );
                  wb.messageSkipWaiting();
                }}
                size="sm"
                light
              >
                Refresh
              </Button>,
            ];
          },
          showClose: true,
        });
      }
    };
    /*
      if (confirm('A newer version of Notal is available, reload to update?')) {
          
          wb.addEventListener('controlling', event => {
              window.location.reload()
          })

          // Send a message to the waiting service worker, instructing it to activate.
          wb.messageSkipWaiting()
          
      } else {
          Log.debug(
              'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
          )
      }
      */

    wb.addEventListener("waiting", promptNewVersionAvailable);

    // ISSUE - this is not working as expected, why?
    // I could only make message event listenser work when I manually add this listenser into sw.js file
    wb.addEventListener("message", (event: WorkboxWindow.IWorkboxEvent) => {
      Log.debug(`Event ${event.type} is triggered.`);
      Log.debug(event);
    });

    /*
      wb.addEventListener('redundant', event => {
        Log.debug(`Event ${event.type} is triggered.`)
        Log.debug(event)
      })
      wb.addEventListener('externalinstalled', event => {
        Log.debug(`Event ${event.type} is triggered.`)
        Log.debug(event)
      })
      wb.addEventListener('externalactivated', event => {
        Log.debug(`Event ${event.type} is triggered.`)
        Log.debug(event)
      })
      */

    // never forget to call register as auto register is turned off in next.config.js
    wb.register();
  }
}
