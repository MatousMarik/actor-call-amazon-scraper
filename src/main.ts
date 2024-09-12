// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor } from 'apify';
// Crawlee - web scraping and browser automation library (Read more at https://crawlee.dev)

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();
