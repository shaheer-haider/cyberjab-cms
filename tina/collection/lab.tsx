import type { Collection } from 'tinacms';

const Lab: Collection = {
    label: 'Labs',
    name: 'lab',
    path: 'content/labs',
    format: 'mdx',
    ui: {
        router: ({ document }) => {
            return `/labs/${document._sys.filename}`;
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
            description: 'Lab name',
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
            description: 'Detailed lab description',
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
            label: 'Lab Type',
            name: 'labType',
            options: [
                { label: 'Guided Lab', value: 'guided' },
                { label: 'Challenge Lab (CTF)', value: 'challenge' },
            ],
            ui: {
                component: 'select',
            },
            description: 'Guided lab with instructions or CTF challenge',
        },
        {
            type: 'reference',
            label: 'Topic',
            name: 'topic',
            collections: ['topic'],
            description: 'Primary topic category',
        },
        {
            type: 'object',
            label: 'Skills',
            name: 'skills',
            list: true,
            description: 'Skills developed in this lab',
            fields: [
                {
                    type: 'reference',
                    label: 'Skill',
                    name: 'skill',
                    collections: ['skill'],
                    required: true,
                },
            ],
        },
        {
            type: 'image',
            label: 'Cover Photo',
            name: 'photo',
            // @ts-ignore
            uploadDir: () => 'labs',
        },
        {
            type: 'rich-text',
            label: 'Instructions',
            name: 'instructions',
            description: 'Lab instructions (visible to users)',
        },
        {
            type: 'rich-text',
            label: 'Solution',
            name: 'solution',
            description: 'Solution walkthrough (hidden from users)',
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
            label: 'Duration (Minutes)',
            name: 'durationMinutes',
            description: 'Estimated time to complete',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'number',
            label: 'Total Points',
            name: 'totalPoints',
            description: 'Maximum points for this lab',
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
            description: 'Is this lab published?',
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
            label: 'Requires Cyber Range',
            name: 'requiresCyberRange',
            description: 'Requires active cyber range access',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'number',
            label: 'Time Limit (Minutes)',
            name: 'timeLimitMinutes',
            description: 'Time limit for CTF challenges (optional)',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'boolean',
            label: 'Allow Hints',
            name: 'allowHints',
            description: 'Allow users to request hints',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'number',
            label: 'Hint Penalty (%)',
            name: 'hintPenaltyPercent',
            description: 'Score reduction per hint (percentage)',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'number',
            label: 'Max Attempts',
            name: 'maxAttempts',
            description: '0 = unlimited attempts',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'boolean',
            label: 'Allow Time Extension',
            name: 'allowsExtension',
            description: 'Allow users to extend time limit',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'number',
            label: 'Extension Duration (Minutes)',
            name: 'extensionMinutes',
            description: 'Additional time when extension is used',
            ui: {
                component: 'number',
            },
        },
        {
            type: 'object',
            label: 'Flags',
            name: 'flags',
            list: true,
            description: 'CTF flags/objectives for challenge labs',
            fields: [
                {
                    type: 'string',
                    label: 'Name',
                    name: 'name',
                    required: true,
                    description: 'Flag display name',
                },
                {
                    type: 'string',
                    label: 'Description',
                    name: 'description',
                    description: 'What the user needs to find',
                    ui: {
                        component: 'textarea',
                    },
                },
                {
                    type: 'string',
                    label: 'Flag Value',
                    name: 'flagValue',
                    required: true,
                    description: 'The correct flag value or regex pattern',
                },
                {
                    type: 'number',
                    label: 'Points',
                    name: 'points',
                    description: 'Points awarded for this flag',
                    ui: {
                        component: 'number',
                    },
                },
                {
                    type: 'number',
                    label: 'Order',
                    name: 'order',
                    description: 'Display order',
                    ui: {
                        component: 'number',
                    },
                },
                {
                    type: 'string',
                    label: 'Hint',
                    name: 'hint',
                    description: 'Optional hint for this flag',
                    ui: {
                        component: 'textarea',
                    },
                },
                {
                    type: 'number',
                    label: 'Hint Penalty',
                    name: 'hintPenalty',
                    description: 'Points deducted when hint is revealed',
                    ui: {
                        component: 'number',
                    },
                },
                {
                    type: 'boolean',
                    label: 'Case Sensitive',
                    name: 'caseSensitive',
                    description: 'Flag value is case sensitive',
                    ui: {
                        component: 'toggle',
                    },
                },
                {
                    type: 'boolean',
                    label: 'Is Regex',
                    name: 'isRegex',
                    description: 'Treat flag value as regex pattern',
                    ui: {
                        component: 'toggle',
                    },
                },
            ],
        },
        {
            type: 'reference',
            label: 'Related Lesson',
            name: 'lesson',
            collections: ['lesson'],
            description: 'Optional: If this lab is tied to a specific lesson',
        },
    ],
};

export default Lab;
