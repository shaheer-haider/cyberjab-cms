import type { Collection } from 'tinacms';

const Lesson: Collection = {
    label: 'Lessons',
    name: 'lesson',
    path: 'content/lessons',
    format: 'mdx',
    ui: {
        router: ({ document }) => {
            return `/lessons/${document._sys.filename}`;
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
            isTitle: true,
            required: true,
            description: 'Lesson name',
        },
        {
            type: 'string',
            label: 'Slug',
            name: 'slug',
            required: true,
            description: 'URL-friendly identifier',
        },
        {
            type: 'reference',
            label: 'Module',
            name: 'module',
            collections: ['module'],
            required: true,
            description: 'Parent module',
        },
        {
            type: 'number',
            label: 'Order',
            name: 'order',
            description: 'Lesson order within module',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'rich-text',
            label: 'Content',
            name: 'body',
            isBody: true,
            description: 'Lesson content (supports markdown, code blocks, images)',
            templates: [
                {
                    name: 'VideoEmbed',
                    label: 'Video Embed',
                    fields: [
                        {
                            name: 'url',
                            label: 'Video URL',
                            type: 'string',
                            required: true,
                        },
                        {
                            name: 'caption',
                            label: 'Caption',
                            type: 'string',
                        },
                    ],
                },
                {
                    name: 'CodeBlock',
                    label: 'Code Block',
                    fields: [
                        {
                            name: 'code',
                            label: 'Code',
                            type: 'string',
                            ui: {
                                component: 'textarea',
                            },
                        },
                        {
                            name: 'language',
                            label: 'Language',
                            type: 'string',
                            options: ['python', 'javascript', 'bash', 'powershell', 'yaml', 'json', 'sql'],
                        },
                    ],
                },
                {
                    name: 'Callout',
                    label: 'Callout Box',
                    fields: [
                        {
                            name: 'type',
                            label: 'Type',
                            type: 'string',
                            options: ['info', 'warning', 'danger', 'success'],
                        },
                        {
                            name: 'title',
                            label: 'Title',
                            type: 'string',
                        },
                        {
                            name: 'content',
                            label: 'Content',
                            type: 'string',
                            ui: {
                                component: 'textarea',
                            },
                        },
                    ],
                },
            ],
        },
        {
            type: 'number',
            label: 'Duration (Minutes)',
            name: 'durationMinutes',
            description: 'Estimated time to complete',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'boolean',
            label: 'Has Lab',
            name: 'hasLab',
            description: 'Does this lesson have an associated lab?',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'reference',
            label: 'Lab',
            name: 'lab',
            collections: ['lab'],
            description: 'Optional: Link to associated lab',
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
    ],
};

export default Lesson;
