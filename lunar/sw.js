const cacheName = "offline-cache-v1";
const cacheUrls = [
  "./",
  "./data/int.json",
  "./data/nat.json",
  "./data/other.json",
  
  "./data/solar_ns_events.json",
 
 
  "./data/2076_detailed.json",
  "./data/2077_detailed.json",
  "./data/2078_detailed.json",
  "./data/2079_detailed.json",
  "./data/2080_detailed.json",
  "./data/2081_detailed.json",
 
  "./data/public_holidays.json",
 
 
  "./css/tithi.css",
  "./css/bootstrap.min.css",
  "./css/jquery.dataTables.min.css.css",
  "./js/NS.js",
  "./js/NS_AD.js",
  "./js/NS_BS.js",
  "./js/AD_BS.js",
  

  "./js/event_list.js",
  "./js/index_list.js",
  "./js/jquery.dataTables.min.js",
  "./js/jquery-3.7.0.min.js",
 
  
  "./index_list.html",
];

// Installing the Service Worker
self.addEventListener("install", async (event) => {
  try {
    const cache = await caches.open(cacheName);
    await cache.addAll(cacheUrls);
  } catch (error) {
    console.error("Service Worker installation failed:", error);
  }
});

// Fetching resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);

      try {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          console.log("cachedResponse: ", event.request.url);
          return cachedResponse;
        }

        const fetchResponse = await fetch(event.request);
        if (fetchResponse) {
          console.log("fetchResponse: ", event.request.url);
          await cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        }
      } catch (error) {
        console.log("Fetch failed: ", error);
        const cachedResponse = await cache.match("index.html");
        return cachedResponse;
      }
    })()
  );
});
