// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor } from 'apify';
import axios from 'axios';
import { Input } from './types.js';
// Crawlee - web scraping and browser automation library (Read more at https://crawlee.dev)

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

const {
    useClient = false,
    memory = 4096,
    fields = ['title', 'itemUrl', 'offer'],
    maxItems = 10,
} = await Actor.getInput<Input>() ?? {} as Input;

const TASK = 'matymar/dummy-amazon-scraper-google-pixel-task';

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();
