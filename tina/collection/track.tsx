import type { Collection } from 'tinacms';

const Track: Collection = {
    label: 'Tracks',
    name: 'track',
    path: 'content/tracks',
    format: 'mdx',
    ui: {
        router: ({ document }) => {
            return `/tracks/${document._sys.filename}`;
        },
    },
    fields: [
        {
            type: 'string',
            label: 'External ID',
            name: 'externalId',
            description: 'UUID for import/export operations',
        },
        {
            type: 'string',
            label: 'Name',
            name: 'name',
            required: true,
            description: 'Track name (e.g., SOC Analyst Path)',
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
            description: 'Detailed track description',
        },
        {
            type: 'string',
            label: 'Short Description',
            name: 'shortDescription',
            description: 'Brief summary (max 300 characters)',
            ui: {
                component: 'textarea',
            },
        },
        {
            type: 'string',
            label: 'Track Type',
            name: 'trackType',
            options: [
                { label: 'Job Track', value: 'job' },
                { label: 'Skill Track', value: 'skill' },
                { label: 'Custom Track', value: 'custom' },
            ],
            ui: {
                component: 'select',
            },
            description: 'Job Track (SOC Analyst path) or Skill Track',
        },
        {
            type: 'number',
            label: 'Estimated Hours',
            name: 'estimatedHours',
            description: 'Estimated hours to complete the track',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'reference',
            label: 'Topic',
            name: 'topic',
            collections: ['topic'],
            description: 'Primary topic category',
        },
        {
            type: 'image',
            label: 'Cover Photo',
            name: 'photo',
            // @ts-ignore
            uploadDir: () => 'tracks',
        },
        {
            type: 'string',
            label: 'Icon',
            name: 'icon',
            description: 'Icon name from lucide-react',
        },
        {
            type: 'string',
            label: 'Color',
            name: 'color',
            description: 'Hex color code for this track',
            ui: {
                component: 'color',
            },
        },
        {
            type: 'string',
            label: 'Difficulty',
            name: 'difficulty',
            options: [
                { label: 'Easy', value: 'easy' },
                { label: 'Medium', value: 'medium' },
                { label: 'Hard', value: 'hard' },
            ],
            ui: {
                component: 'select',
            },
        },
        {
            type: 'number',
            label: 'Duration (Hours)',
            name: 'durationHours',
            description: 'Estimated hours to complete entire track',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'string',
            label: 'Access Level',
            name: 'accessLevel',
            options: [
                { label: 'Free', value: 'free' },
                { label: 'Basic', value: 'basic' },
                { label: 'Premium', value: 'premium' },
            ],
            ui: {
                component: 'select',
            },
            description: 'Minimum tier required',
        },
        {
            type: 'boolean',
            label: 'Published',
            name: 'isPublished',
            description: 'Is this track published?',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'boolean',
            label: 'Featured',
            name: 'isFeatured',
            description: 'Show in featured section',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'boolean',
            label: 'Cyber Range',
            name: 'isCyberRange',
            description: 'Part of Cyber Range curriculum',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'object',
            label: 'Steps',
            name: 'steps',
            list: true,
            description: 'Ordered list of modules and labs in this track',
            ui: {
                itemProps: (item) => {
                    return { label: item?.name || 'Step' };
                },
            },
            fields: [
                {
                    type: 'string',
                    label: 'Step Name',
                    name: 'name',
                    required: true,
                    description: 'Name for this step (e.g., "Foundation", "Advanced")',
                },
                {
                    type: 'string',
                    label: 'Description',
                    name: 'description',
                    description: 'Brief description of what this step covers',
                    ui: {
                        component: 'textarea',
                    },
                },
                {
                    type: 'number',
                    label: 'Order',
                    name: 'order',
                    required: true,
                    description: 'Step order in track',
                    ui: {
                        component: 'number',
                    },
                },
                {
                    type: 'string',
                    label: 'Step Type',
                    name: 'stepType',
                    options: [
                        { label: 'Module', value: 'module' },
                        { label: 'Lab', value: 'lab' },
                        { label: 'Checkpoint', value: 'checkpoint' },
                    ],
                    ui: {
                        component: 'select',
                    },
                    description: 'Type of content in this step',
                },
                {
                    type: 'reference',
                    label: 'Module',
                    name: 'module',
                    collections: ['module'],
                    description: 'Select module (if stepType is "module")',
                },
                {
                    type: 'reference',
                    label: 'Lab',
                    name: 'lab',
                    collections: ['lab'],
                    description: 'Select lab (if stepType is "lab")',
                },
                {
                    type: 'boolean',
                    label: 'Required',
                    name: 'isRequired',
                    description: 'Is this step required for track completion?',
                    ui: {
                        component: 'toggle',
                    },
                },
                {
                    type: 'boolean',
                    label: 'Locked',
                    name: 'isLocked',
                    description: 'Requires previous step completion',
                    ui: {
                        component: 'toggle',
                    },
                },
            ],
        },
    ],
};

export default Track;
