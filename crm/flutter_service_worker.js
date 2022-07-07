'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9a6d25d802dbb04188e879217d8296fd",
"assets/assets/icons/logo.png": "26c8bf4d404cb7d921f79e5e104153fb",
"assets/assets/images/1_-CqvtNERaOQobH07F-CmPQ.jpeg": "4634f1cc0aa48929c087b2a0c5b909d5",
"assets/assets/images/7b4c785ab6d6cc780a8b30b0a1d07b7a.jfif": "79a46b91a2c126dafd7271b162e29c21",
"assets/assets/images/85ac1264e77e338d659c549a0be45d34_1.JPG": "1097617e4b0f0786da2ec070a5e7d555",
"assets/assets/images/de50d7af59a21e04e31cd0b82d40f80a_1.JPG": "c69e0f800b1a18523fc5b4af83802dcc",
"assets/assets/images/desmond.jpg": "20dac1a7d733b39489726e330088ee2b",
"assets/assets/images/ea3d283a8a2aff2050c05b109072310b.jfif": "5e25c004db10cdb6af5e31811a39a5dd",
"assets/assets/images/engagekiss.jpg": "07a8a214955d2a6dfdbd35ab92e0fd4f",
"assets/assets/images/error.png": "34a3c86257800bf5e90595c112370b19",
"assets/assets/images/FJos_P0aMAI2ywt.jpg": "e904ba381a967a4328e691baa59a03c0",
"assets/assets/images/gordon_ramsay.jfif": "15215c6ede1b65000317506c167a5d57",
"assets/assets/images/graham.jpeg": "854df921293ef36220cdfc71677986d8",
"assets/assets/images/icon.png": "e01be10094048c32a6b986b73f62d6df",
"assets/assets/images/IMG-20220604-WA0004_1.jpg": "6364c690ebc08014ccf3634658f8f881",
"assets/assets/images/lycoris.jfif": "1817e6d4df3673c28d4af6f0578d798c",
"assets/assets/images/name.png": "f84e40081420041ba62a09732a28eb5b",
"assets/assets/images/Nijigasaki-High-School-Idol-Club-Colorful-Dreams-Colorful-Smiles-Temp.jpg": "2c8111c0850a0901d5edb04ed6bc078b",
"assets/assets/images/P000000690.jpg": "d852d1fc5569be136b010a6d85f89f48",
"assets/assets/images/P000000804.jpg": "ff07dd71cf601176bf28c9834d51b916",
"assets/assets/images/P000000890.jpg": "d44cc96e4f119b4fcb2cb8375d16347d",
"assets/assets/images/PfXC2vH.jpg": "d2f9c6acbb27536c8477aa316f43ea54",
"assets/assets/images/profile.jpg": "f9bead6a645c076fb2d75a6b9dd6689b",
"assets/assets/images/simon.jpg": "ec1830862e17787101c195e4925dea6a",
"assets/assets/images/soIWDD4h.jpg": "51709fabd9c2ad912476e07595ad5f25",
"assets/assets/images/spider.jpg": "cc77ccd01d3135298523965cd7057b1c",
"assets/assets/images/Starlight_Prologue_Insert_Single_2_Cover.jpg": "52d8fa18599474f264fa6f123942db9d",
"assets/assets/languages/ch-CN.json": "314e6840709af3c48ceb8e00a39cb987",
"assets/assets/languages/en-US.json": "cbf219c914beb09ad1ee084a7189897d",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "83f42e6f02d3b8559dbef5ba24670a00",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "039212a5cb91f7e29ef26ce36827eae2",
"/": "039212a5cb91f7e29ef26ce36827eae2",
"main.dart.js": "1fda4334913bd1417b5e3ca626de6e27",
"manifest.json": "6c2f75dd8906e78a135bc046dbdccec6",
"version.json": "604d4f5f22c2e252f515cb4ed1429161"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
