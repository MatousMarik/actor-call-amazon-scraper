// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor } from 'apify';
import axios from 'axios';
import { Input } from './types.js';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

const {
    useClient = false,
    memory = 4096,
    fields = ['title', 'itemUrl', 'price'],
    maxItems = 10,
} = await Actor.getInput<Input>() ?? {} as Input;

const TASK = 'matymar/dummy-amazon-scraper-google-pixel-task';

const withClient = async () => {
    const client = Actor.newClient();
    const task = client.task(TASK);

    const { id } = await task.call({ memory });

    const dataset = client.run(id).dataset();

    const items = await dataset.downloadItems('csv', {
        limit: maxItems,
        fields,
    });

    // If the content type is anything other than JSON, it must
    // be specified within the third options parameter
    return Actor.setValue('OUTPUT', items, { contentType: 'text/csv' });
};

const withAPI = async () => {
    const uri = `https://api.apify.com/v2/actor-tasks/${TASK}/run-sync-get-dataset-items?`;
    const url = new URL(uri);

    url.search = new URLSearchParams({
        memory,
        format: 'csv',
        limit: maxItems,
        fields: fields.join(','),
        token: process.env.APIFY_TOKEN,
    }.toString()).toString();

    const { data } = await axios.post(url.toString());

    return Actor.setValue('OUTPUT', data, { contentType: 'text/csv' });
};

if (useClient) {
    await withClient();
} else {
    await withAPI();
}

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit()
await Actor.exit();
