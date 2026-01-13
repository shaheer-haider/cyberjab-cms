import type { Collection } from 'tinacms';

const Module: Collection = {
    label: 'Modules',
    name: 'module',
    path: 'content/modules',
    format: 'mdx',
    ui: {
        router: ({ document }) => {
            return `/modules/${document._sys.filename}`;
        },
    },
    fields: [
        {
            type: 'string',
            label: 'Name',
            name: 'name',
            required: true,
            description: 'Module name',
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
            type: 'string',
            label: 'Short Description',
            name: 'short_description',
            description: 'Brief module summary',
            ui: {
                component: 'textarea',
            },
        },
        {
            type: 'string',
            label: 'Description',
            name: 'description',
            description: 'Detailed module description',
            ui: {
                component: 'textarea',
            },
        },
        {
            type: 'reference',
            label: 'Instructor',
            name: 'instructor',
            collections: ['instructor'],
            description: 'Module instructor',
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
            uploadDir: () => 'modules',
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
            description: 'Estimated hours to complete',
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
            description: 'Is this module published?',
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
            type: 'number',
            label: 'Cyber Range Order',
            name: 'cyberRangeOrder',
            description: 'Display order in Cyber Range',
            ui: {
                component: 'number',
            },
        },
    ],
};

export default Module;
