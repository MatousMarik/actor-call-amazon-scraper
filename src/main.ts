import { Actor, log } from 'apify';
import { DownloadItemsFormat } from 'apify-client';
import axios from 'axios';

interface Input {
    memory: number;
    useClient: boolean;
    fields: string[];
    maxItems: number;
    timeout: number;
}

const withClient = async () => {
    log.info('Using client.');
    const client = Actor.newClient();
    const task = client.task(TASK);

    const { defaultDatasetId } = await task.call({ memory, timeout });

    const dataset = client.dataset(defaultDatasetId);

    const items = await dataset.downloadItems(DownloadItemsFormat.CSV, {
        limit: maxItems,
        fields,
    });

    // If the content type is anything other than JSON, it must
    // be specified within the third options parameter
    return Actor.setValue('OUTPUT', items, { contentType: 'text/csv' });
};

const withAPI = async () => {
    log.info('Using API.');
    const uri = `https://api.apify.com/v2/actor-tasks/${TASK}/run-sync-get-dataset-items?`;
    const url = new URL(uri);

    url.search = new URLSearchParams({
        memory: memory.toString(),
        timeout: timeout.toString(),
        format: 'csv',
        limit: maxItems.toString(),
        fields: fields.join(','),
        token: process.env.APIFY_TOKEN || '',
    } as Record<string, string>).toString();

    const { data } = await axios.post(url.toString());

    return Actor.setValue('OUTPUT', data, { contentType: 'text/csv' });
};

// ********* MAIN BELLOW *********

await Actor.init();

const {
    useClient = false,
    memory = 4096,
    timeout = 1000,
    fields = ['title', 'itemUrl', 'price'],
    maxItems = 10,
} = await Actor.getInput<Input>() ?? {} as Input;

const TASK = 'matymar~dummy-amazon-scraper-google-pixel-task';

if (useClient) {
    await withClient();
} else {
    await withAPI();
}

log.info('Finished.');
await Actor.exit();
