import type { Collection } from 'tinacms';

const Topic: Collection = {
    label: 'Topics',
    name: 'topic',
    path: 'content/topics',
    format: 'md',
    fields: [
        {
            type: 'string',
            label: 'Name',
            name: 'name',
            required: true,
            description: 'Topic name (e.g., Azure Security, KQL)',
        },
        {
            type: 'string',
            label: 'Slug',
            name: 'slug',
            required: true,
            isTitle: true,
            description: 'URL-friendly identifier',
        },
        {
            type: 'rich-text',
            label: 'Description',
            name: 'description',
            description: 'Detailed description of this topic',
        },
        {
            type: 'string',
            label: 'Icon',
            name: 'icon',
            description: 'Icon name from lucide-react (e.g., shield, cloud, terminal)',
        },
        {
            type: 'string',
            label: 'Color',
            name: 'color',
            description: 'Hex color code for this topic',
            ui: {
                component: 'color',
            },
        },
        {
            type: 'number',
            label: 'Order',
            name: 'order',
            description: 'Display order (lower numbers appear first)',
            ui: {
                component: 'number',
            },
        },
    ],
};

export default Topic;
